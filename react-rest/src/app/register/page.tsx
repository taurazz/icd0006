"use client";

import { AccountContext } from "@/context/AccountContext";
import { AccountService } from "@/services/AccountService";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const Register = () => {
	const accountService = new AccountService();
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState("");
	const {setAccountInfo} = useContext(AccountContext);

	type Inputs = {
		email: string;
		password: string;
		firstName: string;
		lastName: string;
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>({
		defaultValues: {
			email: "user@test.ee",
			password: "password123",
			firstName: 'David',
			lastName: 'Goggins'
		}
	});

	const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
		console.log(data);
		setErrorMessage("Loading...");
		try {
			var handleRegister = await accountService.register(
				data.email,
				data.password,
				data.firstName,
				data.lastName
			)

			if (handleRegister.errors) {
				setErrorMessage(handleRegister.statusCode + " - " + handleRegister.errors[0]);
				return;
			}

			setAccountInfo!({
				jwt: handleRegister.data?.token,
				firstName: handleRegister.data?.firstName,
				lastName: handleRegister.data?.lastName
			})

			router.push("/dashboard");
			setErrorMessage("");
		} catch (error) {
			setErrorMessage("Register failed. " + (error as Error).message);
		}
	};

  return (
    <>
		<div className="sm:mx-auto sm:w-full sm:max-w-sm">
			{errorMessage}
			<h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
				Create a new account
			</h2>
		</div>

		<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
			<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

				<div>
					<label
						htmlFor="firstName"
						className="block text-sm/2 font-medium text-white"
					>
						First name
					</label>
					<div className="mt-2">
						<input
							type="firstName"
							id="firstName"
							required
							{...register('firstName', { required: 'Name is required'})}
							className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						/>
						{errors.firstName && <span className="mt-1 text-sm text-red-500">{errors.firstName.message}</span>}
					</div>
				</div>

				<div>
					<label
						htmlFor="lastName"
						className="block text-sm/2 font-medium text-white"
					>
						Last Name
					</label>
					<div className="mt-2">
						<input
							type="lastName"
							id="lastName"
							required
							{...register('lastName', { required: 'Name is required'})}
							className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						/>
						{errors.lastName && <span className="mt-1 text-sm text-red-500">{errors.lastName.message}</span>}
					</div>
				</div>

				<div>
					<label
						htmlFor="email"
						className="block text-sm/2 font-medium text-white"
					>
						Email address
					</label>
					<div className="mt-2">
						<input
							type="email"
							id="email"
							required
							{...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
							className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						/>
						{errors.email && <span className="mt-1 text-sm text-red-500">{errors.email.message}</span>}
					</div>
				</div>

				<div>
					<div className="flex items-center justify-between">
						<label
							htmlFor="password"
							className="block text-sm/2 font-medium text-white"
						>
							Password
						</label>

					</div>
					<div className="mt-2">
						<input
							type="password"
							id="password"
							required
							{...register('password', { required: 'Password is required'})}
							className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						/>
						{errors.password && <span className="mt-1 text-sm text-red-500">{errors.password.message}</span>}
					</div>
				</div>

				<div>
					<button
						type="submit"
						className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						Sign up
					</button>
				</div>
			</form>

		</div>
	</>
  );
}
export default Register;
