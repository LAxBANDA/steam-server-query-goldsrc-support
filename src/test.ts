import { queryGameServerInfo } from "./gameServer/gameServer";
import { InfoResponse } from "./gameServer/gameServerTypes";
import { queryMasterServer } from "./masterServer/masterServer";
import { REGIONS } from "./masterServer/masterServerTypes";

const YOUR_IP_TEST = '127.0.0.1'; // Only ip without port

const test = {
    async getGameServersApi(): Promise<any> {

        try {
            const masterResponse = await queryMasterServer('hl2master.steampowered.com:27011', REGIONS.ALL, { gameaddr: YOUR_IP_TEST });

            const allPromises = masterResponse.map(ip => queryGameServerInfo(ip));

            const allPromisesResponse = await Promise.allSettled(allPromises);

            const gameServers = allPromisesResponse.reduce((acc: InfoResponse[], response, index) => {
                response.status === 'fulfilled' && acc.push({ ...response.value, ip: masterResponse[index] });
                return acc;
            }, []);

            return gameServers;
        } catch (error) {
            throw error;
        };
    }
}
test.getGameServersApi().then(r => {
    console.log(r)
})