const express = require('express')
const router = express.Router();
const {Appointments, Users} = require('../models')
const { validateToken } = require('../middlewares/AuthMiddleware');
const {sendMail} = require('../utils/Mailer');

router.get('/', async (req, res) => {
    let result = await Appointments.findAll()
    res.json(result);
});

router.get('/dashboard', validateToken, async (req, res) => {
    const id = req.user.id
    let result = await Appointments.findAll({
        where: {
            userId: id
        },
        include: ['user', 'doctor', 'service'],
        order: [['date', 'ASC']],
    })
    res.json({ result });
});

router.put('/dashboard/delete/:id', async (req, res) => {
    const { id } = req.params;
    console.log('iddddd', id)
    try {
        const myAppointment = await Appointments.findOne({
            where: {
                id
            },
            include: ['user', 'doctor', 'service']
        })
        console.log('myAppointment', myAppointment)
        let resp = await sendMail(
            myAppointment?.doctor?.email,
            `Appointment for ${myAppointment?.service?.name}`,
            `Hello Dr. ${myAppointment?.doctor?.firstName} ${myAppointment?.doctor?.lastName},\n\nYour appointment with patient ${myAppointment?.user?.firstName} ${myAppointment?.user?.firstName} on ${myAppointment?.date} at ${myAppointment?.time} has been cancelled.`,
            `<p>Hello Dr. ${myAppointment?.doctor?.firstName} ${myAppointment?.doctor?.lastName},</p><p>\n\nYour appointment with patient ${myAppointment?.user?.firstName} ${myAppointment?.user?.lastName} on ${myAppointment?.date} at ${myAppointment?.time} has been cancelled.</p>`
        )
        if(resp) {
            await Appointments.update({deletedAt: new Date()},{ where: { id } });
        }

        res.json({ message: 'Appointment deleted successfully.' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ error: 'Unable to delete appointment. Please try again later.' });
    }
});

router.put('/dashboard/edit/:id', async (req, res) => {
    const { id } = req.params;
    const {date, time, doctorId} = req.body
    try {
        await Appointments.update({date, time, doctorId},{ where: { id } });
        res.json({ message: 'Appointment deleted successfully.' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ error: 'Unable to delete appointment. Please try again later.' });
    }
});

router.post('/schedule', validateToken, async (req, res) => {
    try {
        const {date, time, doctor, serviceId} = req.body;
        console.log('date, time, doctor, serviceId', date, time, doctor, serviceId)
        console.log('req.user', req.user)

        let result = await Appointments.create({
            userId: req.user.id,
            serviceId,
            doctorId: doctor, 
            date, 
            time
        });

        const findAppointment = await Appointments.findOne({
            where: {
                id: result.id
            },
            include: ['user', 'doctor', 'service']
        })
        const findUser = await Users.findOne({where: {username: req.user.username}})
        console.log('findAppointment', findAppointment)
        console.log('findUser', findUser)

        await sendMail(
            findUser.email,
            'Appointment with RVT Dental Clinic',
            `Hello ${findUser.firstName} ${findUser.lastName},\n\nThank you for scheduling an appointment! Please confirm the details below:
            \n\nService: ${findAppointment.service.name}\n\nDoctor: ${findAppointment.doctor.firstName} ${findAppointment.doctor.lastName}\n\nDate: ${findAppointment.date}\n\nTime: ${findAppointment.time}`,
            `<p>Hello ${findUser.firstName} ${findUser.lastName},</p><p>\n\nThank you for scheduling an appointment! Please confirm the details below:</p>
            <p>Service: ${findAppointment.service.name}</p><p>Doctor: ${findAppointment.doctor.firstName} ${findAppointment.doctor.lastName}</p><p>Date: ${findAppointment.date}</p><p>Time: ${findAppointment.time}</p>`
        );

        await sendMail(
            findAppointment.doctor.email,
            `Appointment for ${findAppointment.service.name}`,
            `Hello Dr.${findAppointment.doctor.firstName} ${findAppointment.doctor.lastName},\n\nYou have a new appointment! Please check the details below:
            \n\nService: ${findAppointment.service.name}\n\nDoctor: ${findAppointment.user.firstName} ${findAppointment.user.lastName}\n\nDate: ${findAppointment.date}\n\nTime: ${findAppointment.time}`,
            `<p>Hello Dr.${findAppointment.doctor.firstName} ${findAppointment.doctor.lastName},</p><p>You have a new appointment! Please check the details below:</p>
            <p>Service: ${findAppointment.service.name}</p><p>Patient: ${findAppointment.user.firstName} ${findAppointment.user.lastName}</p><p>Date: ${findAppointment.date}</p><p>Time: ${findAppointment.time}</p>`
        );
        return res.json({mesage: 'Appointment successful! Please check your email for more information.'});
    } catch (error) {
        console.log('errorsched', error)
        return res.json({error: 'Unable to set an appointment. Please try again later.'})
    }

});

module.exports = router