import AddsOnCard from "./addsOnCard";
import { sampleAddsOn } from "../../data";

export default function AddsOnListing({ setTitle }) {
  setTitle("Selecciona tus Servicios Adicionales");
  const getAddsOn = () => {
    return sampleAddsOn;
  };

  const addsOnList = getAddsOn();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 lg:gap-8">
      {addsOnList.map((addOn) => (
        <AddsOnCard key={addOn.id} addsOnInfo={addOn} />
      ))}
    </div>
  );
}
