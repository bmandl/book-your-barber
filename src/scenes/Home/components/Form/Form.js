import React from 'react';
import { useForm } from "react-hook-form";

const Form = () => {
    const { register, handleSubmit, watch, errors } = useForm();

    const onSubmit = data => {
        console.log(JSON.stringify(data));
    }

    return (
        <div class="form-container">
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="text" name="firstname" ref={register({required:true})} />
                <input type="text" name="lastname" ref={register({required:true})} />
                <input type="email" name="email" ref={register({required:true, })} />
                <input type="number" name="number" ref={register({required:true, pattern:/ /})} />
                <select name="barber" ref={register({required:true})}>
                    {/*get barbers with api from db.json*/}
                </select>
                <select name="service" ref={register({required:true})}>
                    {/*get services with api from db.json*/}
                </select>
                <input type="date" name="date" ref={register({required:true})} />
                <select name="time" ref={register({required:true})}>
                    {/*get available time termins with api from json.db*/}
                </select>
                <input type="text" name="price" ref={register} disabled /> {/*auto insert price based on selected service*/}
            </form>
        </div>
    );
}

export default Form;