import React, { useState, useEffect, createRef } from 'react';
import { useForm } from "react-hook-form";
import Database from '../../../../services/api/database';

const Form = () => {
    const database = new Database();
    const { register, handleSubmit, watch, errors } = useForm();
    const [barbers, getBarbers] = useState([]);
    const [services, getServices] = useState();
    const [terms, getTerms] = useState();
    const [selectedBarber, setSelectedBarber] = useState();

    useEffect(() => {
        (async () => {
            const response = await database.barbers();
            getBarbers(response);
        })();

        (async () => {
            const response = await database.services();
            getServices(response.map(service => <option key={service["id"]}>{service["name"]}</option>));
        })();
    }, []);

    useEffect(() => {
        if (selectedBarber) {
            (async () => {
                const response = await database.availableTerms(selectedBarber);
                getTerms(response);
            })();
        }
    }, [selectedBarber]);

    const mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //from https://emailregex.com/
    const phoneRegex = /^(([0-9]{3})[ \-\/]?([0-9]{3})[ \-\/]?([0-9]{3}))|([0-9]{9})|([\+]?([0-9]{3})[ \-\/]?([0-9]{2})[ \-\/]?([0-9]{3})[ \-\/]?([0-9]{3}))$/;
    const onSubmit = data => {
        console.log(JSON.stringify(data));
    }

    const handleBarberSelect = (el) => {
        setSelectedBarber(barbers[el.target.selectedIndex]["id"]);
    }

    const resetSelection = (el) => {
        el.target.selectedIndex = -1;
    }

    return (
        <div class="form-container">
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="text" name="firstname" ref={register({ required: true })} />
                <input type="text" name="lastname" ref={register({ required: true })} />
                <input type="email" name="email" ref={register({ required: true, pattern: mailRegex })} />
                <input type="number" name="number" ref={register({ required: true, pattern: phoneRegex })} />
                <select name="barber" ref={register({ required: true })} onFocus={resetSelection} onChange={handleBarberSelect}>
                    {barbers && barbers.map((barber) => <option key={barber["id"]}>{barber["firstName"] + " " + barber["lastName"]}</option>)}
                </select>
                <select name="service" ref={register({ required: true })}>
                    {services}
                </select>
                <input type="date" name="date" ref={register({ required: true })} />
                <select name="time" ref={register({ required: true })}>
                    {/*get available time termins with api from json.db*/}
                </select>
                <input type="text" name="price" ref={register} disabled /> {/*auto insert price based on selected service*/}
                <input type="submit" value="Book appointment" />
            </form>
        </div>
    );
}

export default Form;