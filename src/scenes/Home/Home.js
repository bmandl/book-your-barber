import React from 'react';
import Form from './components/Form';
import './Home.scss';
import image from './image.jpg';

const Home = () => {
    return (
        <div className="container">
            <h1>Book your barber</h1>
            <h2>Great Hair Doesn't Happen By Chance. It Happens By Appointment!<br />
            So Don't Wait And Book Your Appointment Now!</h2>
            <div className="columns is-multiline">
                <div className="column is-narrow-tablet image">
                    <div className="imageBox">
                        <img src={image} alt="barber" />
                    </div>
                </div>
                <div className="column is-narrow-tablet right">
                    <Form />
                </div>
            </div>
        </div>
    )
}


export default Home;