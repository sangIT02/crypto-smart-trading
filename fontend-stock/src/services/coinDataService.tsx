import axios from "axios";

const BASE_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc"
//https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false
const coinDataService = {
    getAllTopCoinMarket(page: number){
        return axios.get(`${BASE_URL}&per_page=200&page=${page}&sparkline=false`);
    }
}

export default coinDataService;

