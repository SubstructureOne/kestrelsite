import { Headers } from "@/components/Headers";
import { Navigation } from "@/components/Navigation";
import { LeftSideMenu, MenuItems } from "@/app/profile/LeftSideMenuComponent";
import { PaymentBanner } from "@/app/profile/PaymentBanner";
import Footer from "@/components/Footer";
import React, { ReactNode } from "react";
import { AccountInfo, UserInfo } from "@/utils/dbtypes";
import { KResult } from "@/utils/errors";

const ProfileContainer: React.FC<{
    userInfo: UserInfo;
    accountInfo: KResult<AccountInfo | null>;
    selected: MenuItems;
    children: ReactNode;
}> = ({ userInfo, accountInfo, selected, children }) => {
    const showBanner =
        accountInfo !== undefined &&
        accountInfo.isOk &&
        (accountInfo.value === null ||
            accountInfo.value.user_status === "Disabled");
    const newUser =
        accountInfo !== undefined &&
        accountInfo.isOk &&
        accountInfo.value === null;
    return (
        <>
            <Headers title="Kestrel: Profile" />
            <Navigation />
            <div className="gap-4 flex">
                <LeftSideMenu selected={selected} userInfo={userInfo} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {showBanner ? (
                        <PaymentBanner newUser={newUser} userInfo={userInfo} />
                    ) : null}
                    {children}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProfileContainer;
