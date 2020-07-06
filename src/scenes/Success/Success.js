import React, { useEffect, useState } from 'react';

import RandomGif from '../../services/api/randomGif';


const Success = () => {
    const [gif, setGif] = useState();

    const randomGif = new RandomGif();
    useEffect(() => {
        (async () => {
            const gif = await randomGif.getRandomGif();
            setGif(gif);
        })();
    }, [randomGif])

    return (<>
        <img src={gif} alt="random gif" />
    </>)
}

export default Success;