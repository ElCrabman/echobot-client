// @ts-nocheck

import { Button, Flex, Text, FormLabel, Grid, Heading, Spacer, Icon, Input } from "@chakra-ui/react";
import { Link } from "react-router-dom"
import axios from "axios";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { IoMdArrowRoundBack, IoMdPerson } from 'react-icons/io';
import { FaKey, FaDiscord, FaMoneyBill, FaCogs } from 'react-icons/fa';
import { DiscordInputs } from "../types";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

/*
type Inputs = {
  example: string
  exampleRequired: string
}*/

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
      } = useForm<DiscordInputs>({ resolver: yupResolver(schema) })
    
    const onSubmit: SubmitHandler<DiscordInputs> = async (data) => {
        const deployment = { type: "discord", data: data };

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

    // TODO : auth for routes !!!!

    const lowerify = (data: any) => {
        let envData = {};
        // Convert the key for the .env to uppercase
        Object.keys(data).forEach((e: string) => {
            envData[e.toLowerCase()] = data[e] 
        });

        return envData;
    }

    useEffect(() => {

        if (!botId)
            return; 

        axios.get(`${import.meta.env.VITE_REMOTE_API}/kubeconfig/configmap/${botId}`)
        .then((res) => {
            console.log(lowerify(res.data));
            reset(lowerify(res.data));
            setModify(true);
        })
        .catch((err) => console.log(err));

    }, []);
      
    return (
        <Flex minH='100vh' w='100%' color='white' bg='#2B2D31' direction='column' py={5} pl={10} gap={20}>
            <Link to="/dashboard" color='#5865F2' >
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
                        <FormLabel>Discord Bot Token :</FormLabel> <Input {...register("discord_token")} />                   
                    </Grid>

                    <Flex alignItems='center' gap={3} >                    
                        <Icon as={ FaDiscord } boxSize={6} color='white' />
                        <Heading>DISCORD SERVER CONFIGURATION</Heading>
                    </Flex>
                    <Grid templateColumns='1fr 3fr'>
                        <FormLabel>Debug Guild :</FormLabel> <Input {...register("debug_guild")} />             
                        <FormLabel>Debug Channel :</FormLabel> <Input {...register("debug_channel")}/>             
                        <FormLabel>Allowed Guilds :</FormLabel> <Input {...register("allowed_guilds")}/>               
                        <FormLabel>Moderation alert channel :</FormLabel> <Input {...register("moderations_alert_channel")} />
                    </Grid>

                    <Flex alignItems='center' gap={3} >                    
                        <Icon as={ IoMdPerson } boxSize={6} color='white' />
                        <Heading>ROLE PERMISSIONS</Heading>
                    </Flex>
                    <Grid templateColumns='1fr 3fr'>
                        <FormLabel>Admin roles :</FormLabel> <Input {...register("admin_roles")} />             
                        <FormLabel>DALL_E roles :</FormLabel> <Input {...register("dalle_roles")} />             
                        <FormLabel>GPT roles :</FormLabel> <Input {...register("gpt_roles")} />               
                        <FormLabel>Translator roles :</FormLabel> <Input {...register("translator_roles")} />
                        <FormLabel>Search roles :</FormLabel> <Input {...register("search_roles")} />
                        <FormLabel>Index roles :</FormLabel> <Input {...register("index_roles")} />
                        <FormLabel>Channel chat roles :</FormLabel> <Input {...register("channel_chat_roles")} />
                        <FormLabel>Channel instruction roles :</FormLabel> <Input {...register("channel_instruction_roles")} />
                        <FormLabel>Chat bypass roles :</FormLabel> <Input {...register("chat_bypass_roles")} />
                        <FormLabel>Summarize roles :</FormLabel> <Input {...register("summarize_roles")} />
                    </Grid>

                    <Flex alignItems='center' gap={3} >                    
                        <Icon as={ FaMoneyBill } boxSize={6} color='white' />
                        <Heading>COST CONFIGURATION</Heading>
                    </Flex>
                    <Grid templateColumns='1fr 3fr'>
                        <FormLabel>User input API keys :</FormLabel> <Input {...register("user_input_api_keys")} /> 
                        <FormLabel>User key DB path :</FormLabel> <Input {...register("user_key_db_path")} />
                        <FormLabel>Max search price :</FormLabel> <Input {...register("max_search_price")} />
                        <FormLabel>Max deep compose price :</FormLabel> <Input {...register("max_deep_compose_price")} />
                    </Grid>

                    <Flex alignItems='center' gap={3} >                    
                        <Icon as={ FaCogs } boxSize={6} color='white' />
                        <Heading>MISC CONFIGURATION</Heading>
                    </Flex>
                    <Grid templateColumns='1fr 3fr'>
                        <FormLabel>Custom bot name :</FormLabel> <Input {...register("custom_bot_name")} /> 
                        <FormLabel>Custom bot logo :</FormLabel> <Input {...register("custom_bot_logo")} /> 
                        <FormLabel>Welcome message :</FormLabel> <Input {...register("welcome_message")} /> 
                        <FormLabel>Bot taggable :</FormLabel> <Input {...register("bot_taggable")} /> 
                        <FormLabel>Pre-moderate :</FormLabel> <Input {...register("pre_moderate")} /> 
                        <FormLabel>Force english :</FormLabel> <Input {...register("force_english")} /> 
                    </Grid>


                    {finished && <Text color='green'>Bot created ! Go bot to the dashboard.</Text>}
                    <Button type='submit' isLoading={loading} loadingText='Creating' >Submit</Button>
                    </Flex>
                </form>
            </Flex>
        </Flex>
    )
}