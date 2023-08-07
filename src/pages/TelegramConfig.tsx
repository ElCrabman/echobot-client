// @ts-nocheck

import { Button, Flex, FormLabel, Grid, Heading, Icon, Input, Spacer, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom"
import axios from "axios";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from 'react-icons/io';
import { FaKey, FaTelegramPlane, FaCogs } from 'react-icons/fa';
import { TelegramInputs } from "../types";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

const schema = yup.object({
    bot_name: yup.string().matches(/^[a-zA-Z]+$/, 'Username must contain only characters').min(3, 'Minimum 3 characters').max(10, 'Maximum 10 characters').required('You need to enter a bot name'),
}).required()


export default function DiscordConfig() {

    // TODO : Check if it's recommended
    let { botId } = useParams();

    // Modify existing ConfigMap or create a new bot
    const [ modify, setModify ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ finished, setFinished ] = useState(false);

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
      } = useForm<TelegramInputs>({ resolver: yupResolver(schema) })
    
    const onSubmit: SubmitHandler<TelegramInputs> = async (data) => {

        // TODO : loading

        const deployment = { type: "telegram", data: data };

        setLoading(true);
        if (modify) {
            await axios.post(`${import.meta.env.VITE_REMOTE_API}/kubeconfig/configmap/${botId}`, deployment, {
                headers: {
                'auth-token': localStorage.getItem('echobot-jwt')
                }
            });
            setLoading(false);
            setFinished(true);
            return;
        }

        await axios.post(`${import.meta.env.VITE_REMOTE_API}/kubeconfig/deploy`, deployment, {
            headers: {
             'auth-token': localStorage.getItem('echobot-jwt')
            }
        });

        setLoading(false);
        setFinished(true);
    }
/*
    // TODO : auth for routes !!!!

    const lowerify = (data) => {
        let envData = {};
        // Convert the key for the .env to uppercase
        Object.keys(data).forEach((e) => {
            envData[e.toLowerCase()] = data[e] 
        });

        return envData;
    }
*/
    useEffect(() => {

        if (!botId)
            return; 

        axios.get(`${import.meta.env.VITE_REMOTE_API}/kubeconfig/configmap/${botId}`)
        .then((res) => {
            reset(res.data);
            setModify(true);
        })
        .catch((err) => console.log(err));

    }, []);
      
    return (
        <Flex minH='100vh' w='100%' color='white' bg='#2B2D31' direction='column' py={5} pl={10} gap={20}>
            <Link to="/dashboard" color='#5865F2'  >
                <Flex alignItems='center' gap={3}>
                    <Icon as={ IoMdArrowRoundBack } />
                    Back to dashboard
                </Flex>
            </Link>

            <Flex w='90%' pl={10} >
                <form onSubmit={handleSubmit(onSubmit)} >
                <Flex direction='column' gap={10}>
                    <Grid templateColumns='1fr 3fr'>
                        <FormLabel>Bot name :</FormLabel> <Input isReadOnly={modify} isInvalid={ errors.bot_name ? true : false} errorBorderColor='crimson' {...register("bot_name")} />
                        <Spacer /> { errors.bot_name && (<Text color='crimson' >{ errors?.bot_name.message }</Text>) }
                    </Grid>

                    <Flex alignItems='center' gap={3} >                    
                        <Icon as={ FaKey } boxSize={6} color='white' />
                        <Heading>API KEYS/TOKENS/IDs</Heading>
                    </Flex>
                    <Grid templateColumns='1fr 3fr'>
                        <FormLabel>Telegram Bot Token :</FormLabel> <Input {...register("TELEGRAM_BOT_TOKEN")} />                   
                    </Grid>

                    <Flex alignItems='center' gap={3} >                    
                        <Icon as={ FaTelegramPlane } boxSize={6} color='white' />
                        <Heading>TELEGRAM SERVER CONFIGURATION</Heading>
                    </Flex>
                    <Grid templateColumns='1fr 3fr'>
                        <FormLabel>Number image modes per page :</FormLabel> <Input {...register("N_IMAGE_MODES_PER_PAGE")} />             
                        <FormLabel>Admin User IDs :</FormLabel> <Input {...register("ADMIN_USER_IDS")}/>             
                        <FormLabel>Allowed Telegram User IDs:</FormLabel> <Input {...register("ALLOWED_TELEGRAM_USER_IDS")}/>               
                        <FormLabel>Blacklisted Telegram Users IDs :</FormLabel> <Input {...register("BLACKLISTED_TELEGRAM_USER_IDS")} />
                    </Grid>

                    <Flex alignItems='center' gap={3} >                    
                        <Icon as={ FaCogs } boxSize={6} color='white' />
                        <Heading>MISC CONFIGURATION</Heading>
                    </Flex>
                    <Grid templateColumns='1fr 3fr'>
                        <FormLabel>Group Trigger Keyword :</FormLabel> <Input {...register("GROUP_TRIGGER_KEYWORD")} />             
                        <FormLabel>Telegram Core Api Hash :</FormLabel> <Input {...register("TELEGRAM_CORE_API_HASH")} />             
                        <FormLabel>Telegram Core API ID :</FormLabel> <Input {...register("TELEGRAM_CORE_API_ID")} />               
                        <FormLabel>Summarize message count :</FormLabel> <Input {...register("SUMMARIZE_MESSAGE_COUNT")} />
                        <FormLabel>Credit price :</FormLabel> <Input {...register("CREDIT_PRICE")} />
                        <FormLabel>Open AI Model :</FormLabel> <Input {...register("OPENAI_MODEL")} />
                    </Grid>

                    {finished && <Text color='green'>Bot created ! Go bot to the dashboard.</Text>}
                    <Button type='submit' isLoading={loading} loadingText='Creating' >Submit</Button>
                    </Flex>
                </form>
            </Flex>
        </Flex>
    )
}