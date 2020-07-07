import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import Database from '../../../../services/api/database';
import { Redirect } from 'react-router-dom';

const Form = () => {
    const database = new Database();
    const today = new Date().toISOString().split('T')[0];
    const { register, handleSubmit, watch, errors } = useForm({
        defaultValues: {
        }
    });
    const [barbers, getBarbers] = useState([]);
    const [services, getServices] = useState();
    const [terms, getTerms] = useState();
    const [selectedBarber, setSelectedBarber] = useState();    //default barber id = 1
    const [selectedDate, setSelectedDate] = useState();    //default date = today
    const [selectedService, setSelectedService] = useState();  //default service id = 1
    const [price, setPrice] = useState();
    const [redirect, fireRedirect] = useState();

    useEffect(() => {
        (async () => {
            const response = await database.barbers();  //api call for barbers
            getBarbers(response);
        })();

        (async () => {
            const response = await database.services(); //api call for services
            getServices(response);
        })();
    }, []);

    useEffect(() => {
        if (services && selectedService)
            setPrice(services.find(service => service.name === watch("service"))["price"]);  //change price input based on selected service
    }, [services, selectedService]);

    useEffect(() => {
        if (selectedBarber && selectedService && selectedDate) {
            (async () => {
                console.log("test");
                const response = await database.availableTerms(selectedBarber, selectedDate, selectedService);  //get available termins for selected date, barber and service
                getTerms(response);
            })();
        }
    }, [selectedBarber, selectedDate, selectedService]);

    const mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //from https://emailregex.com/
    const phoneRegex = /^(([0-9]{3})[ \-\/]?([0-9]{3})[ \-\/]?([0-9]{3}))|([0-9]{9})|([\+]?([0-9]{3})[ \-\/]?([0-9]{2})[ \-\/]?([0-9]{3})[ \-\/]?([0-9]{3}))$/;
    const onSubmit = async data => {
        let startDate = new Date(data.date);
        startDate.setHours(data.time.slice(0, 2));
        startDate.setMinutes(data.time.slice(-2));
        startDate = Date.parse(startDate) / 1000;
        const response = await database.bookAppointment(JSON.stringify({
            startDate,
            barberId: selectedBarber,
            serviceId: selectedService
        }));
        console.log(response);
        fireRedirect(true);
    }

    const handleBarberSelect = el => {
        setSelectedBarber(barbers[el.target.selectedIndex-1].id);
    }

    const handleDateSelect = () => {
        setSelectedDate(watch("date"));
    }

    const handleServiceSelect = () => {
        setSelectedService(services.find(service => service.name == watch("service")).id);
    }

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="text" name="firstname" ref={register({ required: 'Please enter your full name' })} placeholder="First Name" />
                {errors.firstname?.message}
                <input type="text" name="lastname" ref={register({ required: 'Please enter your full name' })} placeholder="Last Name" />
                {errors.lastname?.message}
                <input type="email" name="email" ref={register({ required: true, pattern: mailRegex })} placeholder="Email" />
                {errors.email && "Please enter a valid email"}
                <input type="text" name="number" ref={register({ required: true, pattern: phoneRegex })} placeholder="Contact Number" />
                {errors.number && "Please enter phone number"}
                <select name="barber" ref={register({ required: 'Please select a barber' })} onChange={handleBarberSelect}>
                    {barbers && [<option value="" disabled selected>Select Barber</option>,...barbers.map((barber) => <option key={barber["id"]}>{barber["firstName"] + " " + barber["lastName"]}</option>)]}
                </select>
                {errors.barber?.message}
                <select name="service" ref={register({ required: 'Please select a service' })} onChange={handleServiceSelect}>
                    {services && [<option value="" disabled selected>Select Service</option>,...services.map(service => <option key={service["id"]}>{service["name"]}</option>)]}
                </select>
                {errors.service?.message}
                <input type="text" name="date" ref={register({ required: 'Please pick a date' })} onChange={handleDateSelect} onFocus={el=>el.target.type='date'} onBlur={el=>el.target.type='text'} placeholder="Select Date" />
                {errors.date?.message}
                <select name="time" ref={register({ required: true, maxLength: 5 })} placeholder="Select Time">
                    {terms && terms.length > 0 ? [<option value="" disabled selected>Select Time</option>,...terms.map((term, index) => <option key={index}>{term}</option>)]
                        : [<option value="" disabled selected>Select Time</option>,<option disabled>No available termins</option>]}
                </select>
                {errors.time && "Please pick a time"}
                <input type="text" name="price" ref={register} disabled defaultValue={price} placeholder="Select any service." /> {/*auto insert price based on selected service*/}
                <input type="submit" value="Book appointment" />
            </form>
            {redirect && <Redirect to='/success' from='/' />}
        </div>
    );
}

export default Form;