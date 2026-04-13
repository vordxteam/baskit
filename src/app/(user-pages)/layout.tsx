import FeatureFooter from "@/layout/FeatureFooter";
import UserHeader from "@/layout/UserHeader";
import USP from "./HomePage/USP";

export default function UserPages({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <UserHeader />
      {children}
      <USP />
      <FeatureFooter />
    </div>
  )
}
