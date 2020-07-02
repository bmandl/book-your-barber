
export default class Database {

    constructor (baseUrl = 'https://my-json-server.typicode.com/bmandl/book-your-barber') {
        this.baseUrl = baseUrl;
    }

    async barbers() {
        const barbers =  await fetch(this.baseUrl + '/barbers',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }            
        });        
        return barbers.json();
    }

    async appointments() {
        const appointments = await fetch(this.baseUrl + '/appointments',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }            
        });        
        return appointments.json();
    }

    async workHours() {
        const workHours = await fetch(this.baseUrl + '/workHours',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }            
        });        
        return workHours.json();
    }

    async services() {
        const services = await fetch(this.baseUrl + '/services',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }            
        });        
        return services.json();
    }

    async availableTerms(barberId) {
        let appointments = await this.appointments();
        appointments = (await appointments).filter(appointment => appointment.barberId == barberId);
        const barbers = await this.barbers();
        const workingHours = (await barbers).find(barber => barber.id == barberId)["workHours"];
        return workingHours;    //todo: calculate available terms based on working hours, breaks and appointments for selected barber
    }
}