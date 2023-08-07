import { Box, Image, Text, Flex, Button, Icon, Spacer, useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaStop, FaTrash, FaRedo, FaCog } from 'react-icons/fa';
import DeletionModal from "./DeletionModal";
import { BotType } from '../types';

export default function BotCard({ bots, setBots, id }: { bots: BotType[], setBots: React.Dispatch<React.SetStateAction<BotType[] | null>>, id: String}) {
    
    const bot = bots.find(b => b.id == id);
    const src = (bot?.type == 'discord') ? import.meta.env.VITE_DISCORD_LOGO : import.meta.env.VITE_TELEGRAM_LOGO;
    const statusColor = (bot?.status == 'Active') ? 'green' : ( (bot?.status == 'Stopped') ? 'red' : 'yellow' );
    const [ loading, setLoading ] = useState(false);
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    // Action bar action
    const start = async () => {
        setLoading(true);
        await axios.get(`${import.meta.env.VITE_REMOTE_API}/kubeconfig/start/${id}`, {
            headers: {
             'auth-token': localStorage.getItem('echobot-jwt')
            }
        });
        setLoading(false);
    }

    const stop = async () => {
        setLoading(true);
        await axios.delete(`${import.meta.env.VITE_REMOTE_API}/kubeconfig/stop/${id}`, {
            headers: {
             'auth-token': localStorage.getItem('echobot-jwt')
            }
        });
        setLoading(false);
    }

    const restart = () => console.log(`restart bot ${id}`)

    const remove = async () => {
        
        setLoading(true);

        try {
            let res = await axios.delete(`${import.meta.env.VITE_REMOTE_API}/kubeconfig/delete/${id}`, {
                headers: {
                'auth-token': localStorage.getItem('echobot-jwt')
                }
            });

            if (res.status == 200)
                setBots(bots.filter(b => b.id != id));
        } catch (e: any) {
            console.log(e.message)
        } finally {
            setLoading(false);
            onClose();
        }
    }

    // Action bar types
    const ActiveBar = (
        <Flex gap={1}>
            <Button w={10} h={10} bg='tomato' onClick={stop} isDisabled={loading}> <Icon as={ FaStop } color='white' /> </Button>
            <Button w={10} h={10} bg='teal' onClick={restart} isDisabled={loading}> <Icon as={ FaRedo } color='white' /> </Button>
            <Button w={10} h={10} bg='red' onClick={onOpen} isDisabled={loading}> <Icon as={ FaTrash } color='white' /> </Button>
        </Flex>
    );

    const StoppedBar = (
        <Flex gap={1}>
            <Button w={10} h={10} bg='green' onClick={start} isDisabled={loading}> <Icon as={ FaPlay } color='white' /> </Button>
            <Button w={10} h={10} bg='red' onClick={onOpen} isDisabled={loading}> <Icon as={ FaTrash } color='white' /> </Button>
            <Box w={10} h={10}></Box>
        </Flex>
    )

    // Go to config
    const config = () => {
        if (bot?.type == "discord")
            navigate(`/discord/${id}`); 
        else if ((bot?.type == "telegram"))
            navigate(`/telegram/${id}`); 

    }

    return (
        <Box bg='#313338' borderRadius={10} color='white' py={3} px={10}>   
            <Flex alignItems="center" justifyContent='space-between' gap={5} >   
                <Flex alignItems="center" gap={10}>    
                    <Image src={src} alt='logo' w={20} />
                    <Flex gap={2} >
                        <Text>Name : </Text> 
                        <Text as='b'>{bot?.name}</Text>
                    </Flex>
                    
                </Flex>

                <Flex alignItems='center' justifyContent='center'>
                    <Flex gap={2} >
                        <Text>Status : </Text> 
                        <Text as='b' color={statusColor}>{bot?.status}</Text>
                    </Flex>

                    <Spacer w={10} />

                    { (bot?.status == 'Active') && ActiveBar }
                    { (bot?.status == 'Stopped') && StoppedBar  }
                    { (bot?.status == 'Error') && StoppedBar  }

                    <Spacer w={5} />

                    <Button bg='#6484F4' color='white' onClick={config}>
                        <Icon as={ FaCog } color='white' />
                        <Spacer w={3} />
                        Bot configuration...
                    </Button>
                </Flex>
            </Flex>

            <DeletionModal remove={remove} isOpen={isOpen} onClose={onClose}>{ bot?.name }</DeletionModal>
        </Box>
    );
}