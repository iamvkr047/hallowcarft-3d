import { Link } from "react-router-dom"

export const LandingPage = () => {
    return (
        <div>landing page

            <Link to={"/dashboard"}>go to dashboard</Link>
        </div>
    )
}