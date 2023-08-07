// @ts-nocheck

import { FormControl, FormErrorMessage, FormHelperText, FormLabel, Grid, Input, Spacer } from "@chakra-ui/react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Inputs } from '../types';


export default function CustomInput({ type='text', helperText, register, error, children }: { type: string, helperText: string, register: UseFormRegister<Inputs>, error: FieldErrors<Inputs>, children: string }) {

    return (
        <FormControl isInvalid={error ? true : false}>
            <Grid templateColumns='1fr 3fr' alignItems='center' justifyContent='center' pb={2}>
                <FormLabel>{ children }</FormLabel> <Input type={type} {...register}  />
                <Spacer />
            
            { error ? 
            <FormErrorMessage>{ error.message }</FormErrorMessage>
            :
            <FormHelperText color='white'>{ helperText }</FormHelperText>
            }
            </Grid>
            
        </FormControl>
    )
}