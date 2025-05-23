"use client";

import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/map'), { ssr: false });

export default function Map() {
  return (
    <div className="flex flex-row max-w-3xl mx-auto text-center">
		<div className="basis-1/3 mr-8 ml-8">options</div>
		<div className="basis-2/3">
		<MapComponent>

		</MapComponent>

		</div>
	</div>
  );
}
