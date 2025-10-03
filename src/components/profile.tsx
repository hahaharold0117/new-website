import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { CreditCardIcon } from "lucide-react";
import { useAxios } from "@/lib/axios";
import { UsageData, UserProfile, PaymentHistory } from "@/types";
import { HelpTooltip } from "@/components/ui/tooltip";
import { DataTable } from "@/components/payment/table";
import { ColumnDef } from "@tanstack/react-table";
import { useListPaymentHistorysQuery } from "@/api";
import { PaymentDialogWrapper } from '../components/payment/payment-dialog.tsx'

export function UsageDataComponent() {
  const { data: payment_history, refetch } = useListPaymentHistorysQuery();

  const [openPayForm, setOpenPayForm] = useState<boolean>(false)

  const handlePaymentDialogClose = () => {  
    refetch();
    setOpenPayForm(false);  
  }; 

  const paymentColumns: ColumnDef<PaymentHistory>[] = [
    {
      header: "Amount",
      accessorKey: "amount",
      cell: ({ row }) => {
        const amountInDollars = (row.original.amount / 100).toFixed(2);
        return <span>${amountInDollars}</span>;
      },
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: ({ row }) => {
        return <span>{'storage'}</span>;
      },
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: ({ row }) => {
        return <span>{row.original.description}</span>;
      },
    },
    {
      header: "Date",
      accessorKey: "created_at",
      cell: ({ row }) => {
        const formattedDate = new Date(
          row.original.created_at
        ).toLocaleString();
        return <span>{formattedDate}</span>;
      },
    },
  ];

  const usageColumns: ColumnDef<PaymentHistory>[] = [
    {
      header: "Storage",
      accessorKey: "amount",
      cell: ({ row }) => {
        return <span>100</span>;
      },
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: ({ row }) => {
        return <span>{'storage'}</span>;
      },
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: ({ row }) => {
        return <span></span>;
      },
    },
    {
      header: "Month",
      accessorKey: "created_at",
      cell: ({ row }) => {
        return <span></span>;
      },
    },
  ];

  const onDeposit = () => {
    setOpenPayForm(true);
  }

  return (
    <>
      {/* <Card className="dark:bg-[#1B232D]">
        <CardHeader>
          <CardTitle>Usage Data</CardTitle>
          <CardDescription>
            View total resource consumption across your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data ? (
            <div>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="col-span-1" htmlFor="cpu">
                    CPU-seconds
                  </Label>
                  <Input
                    id="cpu"
                    className="col-span-1"
                    disabled
                    value={data.compute_cpu_s}
                  ></Input>
                  <Progress
                    className="col-span-2"
                    value={(100 * data.compute_cpu_s) / (50 * 60 * 60)}
                  />
                </div>
              </div>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="col-span-1" htmlFor="mem">
                    GB-seconds
                  </Label>
                  <Input
                    id="mem"
                    className="col-span-1"
                    disabled
                    value={data.compute_mem_s}
                  ></Input>
                  <Progress
                    className="col-span-2"
                    value={(100 * data.compute_mem_s) / (50 * 60 * 60 * 2)}
                  />
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="col-span-1" htmlFor="storage">
                    Storage / Maximum  (GB)
                  </Label>
                  <Input
                    id="storage"
                    className="col-span-1"
                    disabled
                    value={`${(data.storage / (1024 ** 3)).toFixed(3).replace(/\.?0+$/, '')} / ${(data.maximum_storage_bytes / (1024 ** 3)).toFixed(3).replace(/\.?0+$/, '')}`}
                  />
                  <Progress
                    className="col-span-2"
                    value={(100 * data.storage) / data.maximum_storage_bytes}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {data ? (
            <Button variant="default" className="space-x-2" disabled>
              <CreditCardIcon />
              <span>Upgrade</span>
            </Button>
          ) : (
            <Skeleton className="w-[100px]" />
          )}
        </CardFooter>
      </Card> */}
      <div className="mt-4">
        <Button variant="default" className="space-x-2" style={{
          height: '37px',
          backgroundColor: '#FF9900',
          borderRadius: '34px',
        }}
          onClick={onDeposit}
        >
          <CreditCardIcon />
          <span>Deposit</span>
        </Button>
        <div className="mt-4">
          <span>Payment History</span>
          <DataTable data={payment_history || []} columns={paymentColumns} />
        </div>

        <div className="mt-4">
          <span>Monthly Usage</span>
          <DataTable data={[]} columns={usageColumns} />
        </div>

      </div>
      <PaymentDialogWrapper open={openPayForm} onClose={() => {
        handlePaymentDialogClose()
      }} />
    </>

  );
}

export function UserProfileComponent() {
  const axios = useAxios();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    axios.get<UserProfile>("/profile").then((resp) => setProfile(resp.data));
  }, []);

  function submit() {
    axios.put("/profile", profile);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Profile ({profile?.id})</CardTitle>
          <CardDescription>Make changes to your personal profile</CardDescription>
        </CardHeader>
        <CardContent>
          {profile ? (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <div>
                  <Label>First Name</Label>
                  <Input
                    className="col-span-1"
                    value={profile.first_name || ''}
                    onChange={(ev) =>
                      setProfile({ ...profile, first_name: ev.target.value })
                    }
                    style={{ height: 57, marginTop: 5, background: 'transparent', borderColor: "#414D5C" }}
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    className="col-span-1"
                    value={profile.last_name || ''}
                    onChange={(ev) =>
                      setProfile({ ...profile, last_name: ev.target.value })
                    }
                    style={{ height: 57, marginTop: 5, background: 'transparent', borderColor: "#414D5C" }}
                  />
                </div>
                <div>
                  <Label className="flex">Company Name <HelpTooltip message="The name of the company you work for or own" /></Label>
                  <Input
                    className="col-span-1"
                    value={profile.company_name || ''}
                    onChange={(ev) =>
                      setProfile({ ...profile, company_name: ev.target.value })
                    }
                    style={{ height: 57, marginTop: 5, background: 'transparent', borderColor: "#414D5C" }}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    className="col-span-1"
                    value={profile.email || ''}
                    onChange={(ev) =>
                      setProfile({ ...profile, email: ev.target.value })
                    }
                    disabled
                    style={{ height: 57, marginTop: 5, background: 'transparent', borderColor: "#414D5C" }}
                  />
                </div>
                <div>
                  <Label>Created Date</Label>
                  <Input
                    className="col-span-1"
                    value={profile.created_at ? profile.created_at.split('T')[0] : ''}
                    onChange={(ev) =>
                      setProfile({ ...profile, created_at: ev.target.value })
                    }
                    disabled
                    style={{ height: 57, marginTop: 5, background: 'transparent', borderColor: "#414D5C" }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          )}
        </CardContent>

      </Card>
      {profile ? (
        <Button variant="default" onClick={submit}
          style={{
            float: 'right',
            width: '110px',
            height: '37px',
            backgroundColor: '#FF9900',
            color: 'black',
            borderRadius: '34px',
            marginTop: 20
          }}
        >
          Save
        </Button>
      ) : (
        <Skeleton className="w-[100px]" />
      )}
    </>
  );
}