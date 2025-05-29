"use client";

import { AccountContext } from "@/context/AccountContext";
import { GpsSessionService } from "@/services/GpsSessionService";
import { GpsSessionTypeService } from "@/services/GpsSessionTypeService";
import { IGpsSession } from "@/types/domain/IGpsSession";
import { IGpsSessionCreate } from "@/types/domain/IGpsSessionCreate";
import { IGpsSessionType } from "@/types/domain/IGpsSessionType";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function SessionEdit() {
	const { accountInfo } = useContext(AccountContext);
	const sessionService = new GpsSessionService();
	const sessionTypeService = new GpsSessionTypeService();
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState("");
	const [sessionTypes, setSessionTypes] = useState<IGpsSessionType[]>([]);
	const [loading, setLoading] = useState(true);
	const params = useParams();
	const id = params?.id as string | undefined;

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<IGpsSessionCreate>();

	useEffect(() => {
		if (!accountInfo?.jwt) {
			router.push("/login");
			return;
		}
		const fetchData = async () => {

			try {
				const typesResult = await sessionTypeService.getAllAsync();
				const sessionsResult = await sessionService.getAllAsync();

				if (typesResult.errors) {
					console.log(typesResult.errors);
					return;
				}
				if (sessionsResult.errors) {
					console.log(sessionsResult.errors);
					return;
				}
				const types = typesResult.data!;
				const fetchedSessions = sessionsResult.data!;
				const findSession = fetchedSessions.find(s => s.id === id);

				setSessionTypes(types);
				setLoading(false);

				if (findSession) {
					let sessionTypeName: string;
					let sessionTypeId: string = "";

					try {
						const parsed = JSON.parse(findSession.gpsSessionType);
						sessionTypeName = parsed.en || '';
					} catch {
						sessionTypeName = findSession.gpsSessionType;
					}
					const matchingType = types.find(type => type.name === sessionTypeName);
					if (matchingType) {
						sessionTypeId = matchingType.id;
					}

					reset({
						gpsSessionTypeId: sessionTypeId,
						name: findSession.name,
						description: findSession.description,
					});
				}

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

		const dataWithId = {
			...data,
			id: id,
			recordedAt: new Date().toISOString(),
		};

		console.log(dataWithId)

		try {
			var handleAddSession = await sessionService.updateAsync(dataWithId)

			if (handleAddSession.errors) {
				setErrorMessage(handleAddSession.statusCode + " - " + handleAddSession.errors[0]);
				return;
			}

			router.push("/sessions");
			setErrorMessage("");
		} catch (error) {
			setErrorMessage((error as AxiosError).message);
		}
	};

  return (
    <>

    <div className="flex flex-col items-center">
		{errorMessage &&
			<div className="bg-gray-900 border border-red-400 text-red-600 px-4 py-3 text-center rounded relative" role="alert">
				<span className="block sm:inline">{errorMessage}</span>
				<span className="absolute top-0 bottom-0 right-0 px-4 py-3">
				</span>
			</div>
		}
		{/* Title and add */}
        <div className="flex justify-between w-full max-w-2xl p-4">
          <h1 className="text-2xl font-semibold">Edit your GPS session {errorMessage}</h1>
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
							{...register('description', { required: 'Description is required'})}
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
						Edit
					</button>
				</div>
			</form>
		</div>
	</div>

	</>
  );
}
