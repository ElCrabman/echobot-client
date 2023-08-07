// @ts-nocheck

import { Box, Button, Flex, Text, Heading, Spacer } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import axios from "axios"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import CustomInput from "../components/CustomInput"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"


type Inputs = {
    email: String,
    username: String,
    password: String,
    passwordconf: String,
  }

const schema = yup.object({
    username: yup.string().matches(/^[a-zA-Z][a-zA-Z0-9]*$/, 'Username must contain ONLY alphanumeric values').min(3, 'Minimum 3 characters').max(10, 'Maximum 10 characters').required('You need to enter a username'),
    email: yup.string().email('Invalid email').required('Please enter your email'),
    password: yup.string().matches(/^(?=.*[a-zA-Z])(?=.*\d)/, 'Password must contain at least one letter and one number').required('Please enter a password'),
    passwordconf: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Please confirm your password'),
}).required()

export default function Register() {

    const [ loading, setLoading ] = useState(false);
    const [ success, setSuccess ] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
      } = useForm<Inputs>({ resolver: yupResolver(schema) })
    
    const onSubmit: SubmitHandler<Inputs> = async (data) => {

        setLoading(true);

        try {
            await axios.post(`${import.meta.env.VITE_REMOTE_API}/auth/register`, data);
            setSuccess(true);
        } catch (e) {
            setError("username", { type: "custom", message: "Username already in use." });
        }
        
        setLoading(false);
    }

    const mailRegister = {
        required: "Email required",
        pattern: {
          value: /\S+@\S+\.\S+/,
          message: "Entered value does not match email format"
        }
    }

    return (
        <Flex h='100vh' w='100%' color='white'>
            <Box w='50%' bg='#313338'>
            </Box>
            
            <Flex w='50%' h='100%' bg='#2B2D31' flexDirection='column' justifyContent='center' alignItems='center' gap={20} >
                <Heading size='3xl'>Register</Heading>
                
                <Box w='70%'>
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <CustomInput helperText=""  error={errors.username} register={register("username")}>Username :</CustomInput>
                        <CustomInput helperText=""  error={errors.email} register={register("email")}>Email :</CustomInput>
                        <CustomInput type='password' helperText=""  error={errors.password} register={register("password")}>Password :</CustomInput>
                        <CustomInput type='password' helperText=""  error={errors.passwordconf} register={register("passwordconf")}>Confirm Password :</CustomInput>

                        <Spacer h={5} />
                        <Flex justifyContent='right'>
                            { !success && <Button type='submit' isLoading={loading} >Submit</Button> }
                            { success && <Text color='green' >Success ! You can now login.</Text> }
                        </Flex>
                    </form>

                    <Spacer h={2} />

                    <Flex justifyContent='right'>
                        <Text>Already have an account ? <Link to="/login" color="#5865F2" > Log in !</Link></Text>
                    </Flex>
                </Box>
                
            </Flex>
        </Flex>
    )
}