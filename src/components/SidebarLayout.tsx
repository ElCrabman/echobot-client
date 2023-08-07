import { Button, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { TbArrowBackUp } from 'react-icons/tb';


export default function SidebarLayout () {

    const [ username, setUsername ] = useState('');
    const [ update, setUpdate ] = useState({discord: false, telegram: false});
    const [ loading, setLoading ] = useState({discord: false, telegram: false});

    const navigate = useNavigate();

    const gotoDashboard = () => navigate('/dashboard');
    const gotoDiscord = () => navigate('/discord');
    const gotoTelegram = () => navigate('/telegram');

    const logout = () => {
        localStorage.removeItem('echobot-jwt');
        navigate('/login');
    }

    const updateBots = async (type: string) => {

        setLoading({ ...loading, [type]: true});

        await axios.get(`${import.meta.env.VITE_REMOTE_API}/kubeconfig/update/${type}`, {
            headers: {
             'auth-token': localStorage.getItem('echobot-jwt')
            }
        });

        setLoading({ ...loading, [type]: false});
        setUpdate({
            ...update,
            [type]: false,
        });

    }

    useEffect(() => {

        // Get the username and update statuses
        axios.get(`${import.meta.env.VITE_REMOTE_API}/auth/info`, {
            headers: {
             'auth-token': localStorage.getItem('echobot-jwt')
            }
        })
        .then((res) => {
            setUsername(res.data.username);
            setUpdate({
                discord: res.data.requiresDiscordUpdate,
                telegram: res.data.requiresTelegramUpdate,
            });
        })
        .catch((err) => console.log(err));

    }, []);

    return (
        <Flex w='100%' minH='100vh' bg='#313338'>
            <Flex w='20%' direction='column' alignItems='center'>
                <Flex color='white' direction='column' pt={3} pr={1} w='100%'>
                    <Flex justifyContent='right' pr={5} >
                        <Heading size='md' >Welcome, {username}</Heading>
                    </Flex>
                    <Flex color='#5865F2' gap={3} alignItems='center' justifyContent='right' pr={5} onClick={logout} _hover={{ cursor: 'pointer' }}>                        
                        <Icon as={ TbArrowBackUp } />
                        <Text>Sign out</Text>
                    </Flex>
                </Flex>

                <Flex direction='column' color='white' w='85%' my={10}>
                    <Button  colorScheme='grey' onClick={gotoDashboard} _hover={{ backgroundColor: "#5865F2" }} >Dashboard</Button>
                    <Button variant='ghost' colorScheme='white' onClick={gotoDiscord} _hover={{ backgroundColor: "#5865F2" }}  >Add Discord Bot</Button>
                    <Button variant='ghost' colorScheme='white' onClick={gotoTelegram} _hover={{ backgroundColor: "#5865F2" }} >Add Telegram Bot</Button>
                </Flex>


                { update.discord &&
                <Flex direction="column" color="white" bg='#5865F2' borderRadius={5} p={4} >
                    New Discord bot version available !
                    <Button onClick={() => updateBots('discord')} isLoading={loading.discord} >Update all</Button>
                </Flex>
                }   

                { update.telegram &&
                <Flex direction="column" color="white" bg='#36A8DD' borderRadius={5} p={4} >
                    New Telegram bot version available !
                    <Button onClick={() => updateBots('telegram')} isLoading={loading.telegram} >Update all</Button>
                </Flex>
                }
            </Flex>

            <Flex w='80%'>
                <Outlet />
            </Flex>
        </Flex>
    )
}