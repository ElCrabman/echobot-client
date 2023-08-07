import { Flex, Heading } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import BotCard from "../components/BotCard";
import { BotType } from '../types';

/*
type BotType = {
    type: String,
    status: String,
    name: String,
}
*/
export default function Dashboard() {

    const [ bots, setBots ] = useState<null | BotType[]>(null);

    useEffect(() => {

        axios.get(`${import.meta.env.VITE_REMOTE_API}/kubeconfig/bots`, {
            headers: {
             'auth-token': localStorage.getItem('echobot-jwt')
            }
        })
        .then((res) => setBots(res.data))
        .catch((err) => console.log(err));

    }, []);

    console.log(localStorage.getItem('echobot-jwt'))


    return (
        <Flex w='100%' minH='100vh' bg='#2B2D31' justifyContent='center' pt='5%'>
            <Flex gap={5} direction='column' w='90%'>
                {
                    bots ? 
                    ( bots.length != 0 ? 
                        bots.map((e, i) => <BotCard bots={bots} setBots={setBots} id={e.id} key={i} />) 
                        :
                        <Heading color='white' >No bots available :( </Heading>
                        )
                    : <Heading color='white' >Loading Bots... </Heading>
                }
            </Flex>

        </Flex>
    )
}