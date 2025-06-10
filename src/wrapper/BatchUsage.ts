import { Usage as UsageFernClient } from "../api/resources/usage/client/Client";

export class Usage extends UsageFernClient { // extend the Fern generated client

  private signals: any[] = [];

  public flush(requestOptions?: any): Promise<unknown[]> {
    return this.recordBulk({ signals: this.signals }, requestOptions);
  }

  public recordUsage(signal: any, requestOptions?: any): void {
    if (!this.signals) {
      this.signals = [];
    }
    this.signals.push(signal);
    if (this.signals.length >= 100) {
      this.recordBulk({ signals: this.signals }, requestOptions);
      this.signals = [];
    }
  }

}
