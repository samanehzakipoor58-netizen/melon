import CardSection from "@/components/Home/CardSection";
import FruitStoresMap from "@/components/Home/FruitStoresMap";
import HeroSection from "@/components/Home/HeroSection";


export default function Home() {

  return (
    <div className="md:px-10 px-0 ">
      <HeroSection />

      <FruitStoresMap />

      <CardSection />
    </div>
  );
}
