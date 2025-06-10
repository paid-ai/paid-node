import * as core from "../core/index.js";
import { Usage as UsageClient } from "../api/resources/usage/client/Client";
import * as Paid from "../api/types/Signal.js";

export class Usage extends UsageClient {

  private signals: any[] = [];

  public flush(
      requestOptions?: UsageClient.RequestOptions,
  ): core.HttpResponsePromise<unknown[]> {
    return this.recordBulk({ signals: this.signals }, requestOptions);
  }

  public record(
      signal: Paid.Signal = {},
      requestOptions?: UsageClient.RequestOptions,
  ): core.HttpResponsePromise<unknown[]> {
    if (!this.signals) {
      this.signals = [];
    }

    this.signals.push(signal);

    if (this.signals.length >= 100) {
      const response = this.recordBulk({ signals: this.signals }, requestOptions);
      this.signals = [];

      return response;
    }

    return core.HttpResponsePromise.fromResult({ data: [], rawResponse: {} as core.RawResponse });
  }

}
