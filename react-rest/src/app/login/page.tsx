"use client";

import { AccountContext } from "@/context/AccountContext";
import { AccountService } from "@/services/AccountService";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const Login = () => {
	const accountService = new AccountService();
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState("");
	const {setAccountInfo} = useContext(AccountContext);

	type Inputs = {
		email: string;
		password: string;
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>({
		defaultValues: {
			email: "lololo@test.ee",
			password: "Abc123.",
		}
	});

	const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
		console.log(data);
		setErrorMessage("Loading...");
		try {
			var handleLogin = await accountService.login(data.email, data.password)

			if (handleLogin.errors) {
				setErrorMessage(handleLogin.statusCode + " - " + handleLogin.errors[0]);
				return;
			}

			setAccountInfo!({
				jwt: handleLogin.data?.token,
				firstName: handleLogin.data?.firstName,
				lastName: handleLogin.data?.lastName
			})

			router.push("/dashboard");
			setErrorMessage("");
		} catch (error) {
			setErrorMessage("Log in failed. " + (error as Error).message);
		}
	};

	return (
		<>
			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				{errorMessage}
				<h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
					Sign in to your account
				</h2>
			</div>

			<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
				<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
					<div>
						<label
							htmlFor="email"
							className="block text-sm/6 font-medium text-white"
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
								className="block text-sm/6 font-medium text-white"
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
							Sign in
						</button>
					</div>
				</form>

			</div>
		</>
	);
};

export default Login;
