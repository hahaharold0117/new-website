import {
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { API_URL } from "./lib/env";
import { Organization } from "@/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { useSelector, useDispatch } from "react-redux";
import { RootState, setAuth } from "./store";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AgreementPage } from "./components/agreement";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useAxios } from "@/lib/axios";

const regionUrls: { [key: string]: string } = {
  us: "https://app.us-west.chaparral.ai",
  eu: "https://app.eu.chaparral.ai",
  as: "https://app.as.chaparral.ai",
};

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
      <AlertDialog open={!auth.region}>
        <AlertDialogContent style={{ border: "solid 1px #fff" }}>
          <AlertDialogHeader>
            <AlertDialogTitle>Please Select Your Region</AlertDialogTitle>
            <AlertDialogDescription>
              Your region information is missing. Please choose a region to proceed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Select onValueChange={setSelectedRegion}>
            <SelectTrigger>
              <SelectValue placeholder="Select a region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">Americas</SelectItem>
              <SelectItem value="eu">Europe</SelectItem>
              <SelectItem value="as">Asia</SelectItem>
            </SelectContent>
          </Select>
          <AlertDialogFooter>
            <AlertDialogAction disabled={!selectedRegion} onClick={updateRegion}>
              Confirm Region
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={auth.region !== null && !auth.agreed}>
        <AlertDialogContent style={{ border: "solid 1px #fff" }}>
          <AlertDialogHeader>
            <AlertDialogTitle>Chaparral Labs Terms & Conditions</AlertDialogTitle>
            <AlertDialogDescription>
              <AgreementPage />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={agree}>I Accept</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={
          auth.region !== null &&
          auth.agreed &&
          (!auth.affiliation || auth.affiliation.trim() === "")
        }
      >
        <AlertDialogContent style={{ border: "solid 1px #fff" }}>
          <AlertDialogHeader>
            <AlertDialogTitle>Affiliation Required</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide your affiliation to continue using the platform.
            </AlertDialogDescription>
            <input
              type="text"
              placeholder="Enter your affiliation"
              value={affiliationInput}
              onChange={(e) => setAffiliationInput(e.target.value)}
              style={{
                marginTop: "10px",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                width: "100%",
              }}
            />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleAffiliationSubmit} disabled={!affiliationInput.trim()}>
              Submit Affiliation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
  available_orgs: Organization[];
  agreed: boolean;
  tutorial: boolean;
  region: string;
  affiliation: string;
  license_status: string;
}