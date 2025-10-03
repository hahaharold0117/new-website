import {
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { API_URL } from "./lib/env";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, setAuth } from "./store";
import { useAxios } from "@/lib/axios";


export function AuthContextProvider(props: PropsWithChildren) {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [selectedRegion, setSelectedRegion] = useState("");
  const [affiliationInput, setAffiliationInput] = useState("");
  const api = useAxios();
  const navigate = useNavigate();

  function login() {
    // axios
    //   .get<Authentication>(`${API_URL}/login`, { withCredentials: true })
    //   .then((resp) => {
    //     dispatch(setAuth({ auth: resp.data }));
    //   })
    //   .catch(() => {
    //     return axios
    //       .get<string>(
    //         `${API_URL}/oauth/workos/authorize?redirect_uri=${BASE_URL}/login/callback`
    //       )
    //       .then((resp) => {
    //         window.location.href = resp.data.replace(
    //           "Found. Redirecting to ",
    //           ""
    //         );
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       });
    //   });
  }

  function agree() {
    axios
      .post(`${API_URL}/agree`, null, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${auth?.access_token}`,
        },
      })
      .then(() => {
        login();
      });
  }

  useEffect(() => {
    login();
  }, []);


  function updateRegion() {
    if (!selectedRegion) return;

    axios
      .post(`${API_URL}/user/update-region`, { region: selectedRegion, user_id: auth?.user?.id }, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${auth?.access_token}` },
      })
      .then(() => {
        if (auth) {
          dispatch(setAuth({
            auth: {
              ...auth,
              region: selectedRegion
            }
          }));
        }
      })
      .catch((err) => console.log("Error updating region:", err));
  }

  const handleAffiliationSubmit = async () => {
    if (affiliationInput.trim() && auth) {
      await api.put("/update-affiliation", { affiliation: affiliationInput.trim() });
      dispatch(setAuth({
        auth: {
          ...auth,
          affiliation: affiliationInput.trim()
        }
      }));
      setAffiliationInput("");
    }
  };

  if (auth === null) return null;

  return (
    <>
      {props.children}
    </>
  );
}

export interface Authentication {
  access_token: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    id: string;
  };
  agreed: boolean;
  tutorial: boolean;
  region: string;
  affiliation: string;
  license_status: string;
}