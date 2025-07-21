import ProtectedRoute from "@/app/components/ProtectedRoutes/ProtectedRoutes";
import UserDashPage from "./dashboard";


export default function UserPage(){
    return(
        <>
            <ProtectedRoute>
            <UserDashPage />
            </ProtectedRoute>

        </>
    )
}