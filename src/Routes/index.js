import { useRoutes } from "react-router-dom";
import { Home } from "../Pages/Home";
import Login from "../Pages/Login";
import { Signup } from "../Pages/Signup";
import Protected from "../utils/Protected";
export default function Router() {
  let element = useRoutes([
    ...[
      // Protected Routes
      {
        element: <Protected />,
        children: PROTECTED_ROUTES,
      },
    ],
    ...PUBLIC_ROUTES,
  ]);
  return element;
}

const PROTECTED_ROUTES = [{ path: "/", element: <Home /> }];

const PUBLIC_ROUTES = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
];
