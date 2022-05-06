/** @format */

import { RESOURCE } from "common/queryKey";
import { useQueryClient } from "react-query";

export default function useResource() {
  const queryClient = useQueryClient();
  const resource: any = queryClient.getQueryData(RESOURCE);

  return resource?.data;
}
