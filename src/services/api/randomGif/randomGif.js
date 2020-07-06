export default class RandomGif {
    constructor() {
        this.baseUrl = "http://api.giphy.com/v1/gifs/search?api_key=KeTn0RgXZQF8EDkUGgQmSaJYuWPEz5mI&q=barber";
    }

    async getRandomGif() {
        const gifs = await fetch(this.baseUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = (await gifs.json()).data;
        return data[Math.floor(Math.random()*data.length)].images.original.url;
    }
}