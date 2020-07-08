import React, { useEffect, useState } from 'react';

import RandomGif from '../../services/api/randomGif';
import './Success.scss';

const Success = () => {
    const [gif, setGif] = useState();

    const randomGif = new RandomGif();
    useEffect(() => {
        (async () => {
            const gif = await randomGif.getRandomGif();
            setGif(gif);
        })();
    }, [randomGif])

    return (
        <div className="container vertical-center">
            <p className="booked-text">Appointment successfully booked</p>
            <div className="imageBox column is-narrow is-inline-block">
                <img src={gif} alt="random gif" />
            </div>
        </div>
    )
}

export default Success;