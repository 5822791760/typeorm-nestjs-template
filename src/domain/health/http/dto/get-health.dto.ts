import { IStandardSingleApiResponse } from '@core/util/http/http.standard';

// ===== response =====
class GetHealthData {
  heap: string;
  // rss: string;
  db: string;
}

export class GetHealthResponse implements IStandardSingleApiResponse {
  success: boolean;
  key: string;
  data: GetHealthData;
}
