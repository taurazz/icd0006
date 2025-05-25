"use client";

import { AccountContext } from "@/context/AccountContext";
import { GpsSessionService } from "@/services/GpsSessionService";
import { GpsSessionTypeService } from "@/services/GpsSessionTypeService";
import { IGpsSessionCreate } from "@/types/domain/IGpsSessionCreate";
import { IGpsSessionType } from "@/types/domain/IGpsSessionType";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function SessionCreate() {
	const { accountInfo } = useContext(AccountContext);
	const sessionService = new GpsSessionService();
	const sessionTypeService = new GpsSessionTypeService();
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState("");
	const [sessionTypes, setSessionTypes] = useState<IGpsSessionType[]>([]);
	const [loading, setLoading] = useState(true);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IGpsSessionCreate>();

	useEffect(() => {
		if (!accountInfo?.jwt) {
			router.push("/login");
			return;
		}
		const fetchData = async () => {
			try {
				const result = await sessionTypeService.getAllAsync();

				if (result.errors) {
					console.log(result.errors);
					return;
				}

				setSessionTypes(result.data!);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, [accountInfo, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

	const onSubmit: SubmitHandler<IGpsSessionCreate> = async (data: IGpsSessionCreate) => {
		console.log(data);
		setErrorMessage("Loading...");

		try {
			var handleAddSession = await sessionService.addAsync(data)

			if (handleAddSession.errors) {
				setErrorMessage(handleAddSession.statusCode + " - " + handleAddSession.errors[0]);
				return;
			}

			router.push("/profile");
			setErrorMessage("");
		} catch (error) {
			setErrorMessage((error as AxiosError).message);
		}
	};

  return (
    <>

    <div className="flex flex-col items-center">
		{/* Title and add */}
        <div className="flex justify-between w-full max-w-2xl p-4">
          <h1 className="text-2xl font-semibold">Create a new GPS session {errorMessage}</h1>
        </div>

		<div className="flex w-full max-w-2xl mx-auto p-4">
			{/* Search */}
			<form className="space-y-6 w-full" onSubmit={handleSubmit(onSubmit)}>

				<div>
					<label
						htmlFor="gpsSessionTypeId"
						className="block text-sm/6 font-medium text-white"
					>
						Session Type
					</label>
					<div className="mt-2">
						<select
							id="gpsSessionTypeId"
							{...register("gpsSessionTypeId", { required: "Session type is required" })}
							className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						>
						<option value="">Select session type</option>
							{sessionTypes.map((type) => (
								<option key={type.id} value={type.id}>
								{type.name}
								</option>
							))}
						</select>
							{errors.gpsSessionTypeId && (
								<span className="mt-1 text-sm text-red-500">{errors.gpsSessionTypeId.message}</span>
							)}
					</div>
				</div>

				<div>
					<label
						htmlFor="name"
						className="block text-sm/6 font-medium text-white"
					>
						Name
					</label>
					<div className="mt-2">
						<input
							type="name"
							id="name"
							required
							{...register('name', { required: 'Name is required'})}
							className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						/>
						{errors.name && <span className="mt-1 text-sm text-red-500">{errors.name.message}</span>}
					</div>
				</div>
				<div>
					<label
						htmlFor="description"
						className="block text-sm/6 font-medium text-white"
					>
						Description
					</label>
					<div className="mt-2">
						<textarea
							id="description"
							required
							{...register('description', { required: 'description is required'})}
							className="block w-full rounded-md resize-none bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
						/>
						{errors.description && <span className="mt-1 text-sm text-red-500">{errors.description.message}</span>}
					</div>
				</div>
				<div>
					<button
						type="submit"
						className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						Start the session
					</button>
				</div>
			</form>
		</div>
	</div>

	</>
  );
}
