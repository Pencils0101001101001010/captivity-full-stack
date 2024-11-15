import BestSeller from "./_components/BestSeller";
import CarouselPlugin from "./_components/CarouselPlugin";
import CategoryImages from "./_components/CategorySection";

const WelcomePage = () => {
  return (
    <div className="my-4">
      <CarouselPlugin />
      <BestSeller />
      <CategoryImages />
    </div>
  );
};

export default WelcomePage;
