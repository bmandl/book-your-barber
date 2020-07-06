
export default class Database {

    constructor(baseUrl = 'https://my-json-server.typicode.com/bmandl/book-your-barber') {
        this.baseUrl = baseUrl;
    }

    async barbers() {
        const barbers = await fetch(this.baseUrl + '/barbers', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return barbers.json();
    }

    async appointments() {
        const appointments = await fetch(this.baseUrl + '/appointments', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return appointments.json();
    }

    async workHours() {
        const workHours = await fetch(this.baseUrl + '/workHours', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return workHours.json();
    }

    async services() {
        const services = await fetch(this.baseUrl + '/services', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return services.json();
    }

    async bookAppointment(appointment) {
        const response = await fetch(this.baseUrl + '/appointments', {
            method: 'POST',
            body: appointment
        });

        return response.json();
    }

    async availableTerms(barberId, selectedDate, selectedService) {
        const services = await this.services();
        let appointments = await this.appointments();
        const barbers = await this.barbers();

        //get appointments for selected barber on selected date - return object with start and end in unix timestamp format
        appointments = (await appointments)
            .filter(appointment => appointment.barberId === barberId && new Date(appointment.startDate * 1000).toDateString() === new Date(selectedDate).toDateString())
            .map(app => ({ start: app.startDate, end: app.startDate + services.find(service => service.id === app.serviceId).durationMinutes * 60 * 1000 }));

        //get working hours for selected barber on selected day with included lunch time - everything in unix timestamp       
        let workingHours = (await barbers)
            .find(barber => barber.id === barberId)["workHours"]
            .find(hours => hours.day === new Date(selectedDate).getDay());
        workingHours = (() => {
            let startDate = new Date(selectedDate), endDate = new Date(selectedDate), startLunch = new Date(selectedDate), endLunch = new Date(selectedDate);
            startDate.setHours(workingHours.startHour);
            endDate.setHours(workingHours.endHour);
            startLunch.setHours(workingHours.lunchTime.startHour);
            endLunch.setHours(workingHours.lunchTime.startHour);
            endLunch.setMinutes(workingHours.lunchTime.durationMinutes);
            return (
                {
                    start: Date.parse(startDate) / 1000,
                    end: Date.parse(endDate) / 1000,
                    lunch: { start: Date.parse(startLunch) / 1000, end: Date.parse(endLunch) / 1000 }
                });
        })();

        let availableHours = (() => {
            let serviceDuration = services.find(service => service.id === selectedService)["durationMinutes"] * 60;
            let serviceStart = workingHours.start;
            let serviceEnd = serviceStart + serviceDuration;
            let termins = [];
            while (serviceEnd <= workingHours.end) {
                if ((serviceEnd <= workingHours.lunch.start || serviceStart >= workingHours.lunch.end)    //before or after lunch time
                    && appointments.every(app => serviceEnd <= app.start || serviceStart >= app.end               //not overlaping with other appointments
                    )) {
                    let dateTime = new Date(serviceStart * 1000);
                    termins.push(("0" + dateTime.getHours()).slice(-2) + ":" + ("0" + dateTime.getMinutes()).slice(-2))                                                       //add available termin
                }
                serviceStart = (serviceEnd <= workingHours.lunch.end && serviceStart >= workingHours.lunch.start) ?  //next appointment start immediately after lunch end
                    workingHours.lunch.end : serviceEnd;
                serviceEnd = serviceStart + serviceDuration;
            }
            return termins;
        })();

        return availableHours;    //todo: calculate available terms based on working hours, breaks and appointments for selected barber and date
    }
}