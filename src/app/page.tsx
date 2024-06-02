import { Metadata, NextPage } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Kestrel: The Substructure for Open Source Software as a Service",
};

const Home: NextPage = () => {
    redirect("/profile");
};

export default Home;
