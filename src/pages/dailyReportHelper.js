export const dailyReportInitalParagraph = (reportData, setInitialParagraph) => {
  if (reportData) {
    let initalParaText = `Overall account spend was Rs.${reportData.totalCostYesterday} ${reportData.statusCost} as compared to ${reportData.dayBeforeYesterdayDayName}. `;

    if (
      reportData.totalImpressionsYesterday >
      reportData.totalImpressionsDayBeforeYesterday
    ) {
      if (
        reportData.totalClicksYesterday >
        reportData.totalClicksDayBeforeYesterday
      ) {
        if (
          reportData.totalAvgCPCYesterday <
          reportData.totalAvgCPCDayBeforeYesterday
        ) {
          if (
            reportData.totalCostYesterday <
            reportData.totalCostDayBeforeYesterday
          ) {
            if (
              reportData.totalCTRYesterday >
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `Both Impressions and clicks increased by ${Math.abs(
                reportData.changePercentImpressions
              )}% and ${Math.abs(
                reportData.changePercentClicks
              )}% respectively as "conditions for increase in impressions". Click volume increased as "conditions for increase in clicks". This led CTR to improve by ${Math.abs(
                reportData.changePercentCTR
              )}%. Avg. CPC was efficient by ${Math.abs(
                reportData.changePercentAvgCPC
              )}% and was at ${
                reportData.additionalFieldsDayBeforeYesterday.total_avg_cpc
              } as we saw lower competition. This led overall cost to be reduced by ${Math.abs(
                reportData.changePercentCost
              )}%. We received q leads yesterday with a CPL of Rs.123. The location which through which received the most clicks was "City". We received x leads from "City1" and y leads from "City2."`;
              setInitialParagraph(initalParaText);
            } else if (
              reportData.totalCTRYesterday <
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `Both impressions and clicks increased by ${Math.abs(
                reportData.changePercentImpressions
              )}% and ${Math.abs(
                reportData.changePercentClicks
              )}% respectively. Impressions increased as "Conditions for increase in imps" while clicks increased as "conditions for increase in clicks". CTR dropped by ${Math.abs(
                reportData.changePercentCTR
              )}% and was at ${reportData.additionalFieldsDayBeforeYesterday.total_ctr.toFixed(
                2
              )}% as the ad copy performance dropped. Avg. CPC was efficient as competition lowered and was at t%. This led cost to decrease by ${
                reportData.changePercentCost
              }%.`;
              setInitialParagraph(initalParaText);
            }
          } else if (
            reportData.totalCostYesterday >
            reportData.totalCostDayBeforeYesterday
          ) {
            if (
              reportData.totalCTRYesterday <
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `Both Impressions and clicks increased by ${Math.abs(
                reportData.changePercentImpressions
              )}% and ${Math.abs(
                reportData.changePercentClicks
              )}% respectively as "conditions for increase in impressions". Click volume increased as "conditions for increase in clicks". CTR was at ${reportData.additionalFieldsDayBeforeYesterday.total_ctr.toFixed(
                2
              )}% which was down by ${Math.abs(
                reportData.changePercentCTR
              )}%. Avg.CPC was efficient by x% due to a drop in competition. However, cost increased by ${
                reportData.changePercentCost
              }% as click volume increased. We received q leads yesterday with a CPL of Rs.123. The location which through which received the most clicks was "City". We received x leads from "City1" and y leads from "City2."`;
              setInitialParagraph(initalParaText);
            } else if (
              reportData.totalCTRYesterday >
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `Both impressions and clicks increased by ${Math.abs(
                reportData.changePercentImpressions
              )}% and ${Math.abs(
                reportData.changePercentClicks
              )}% respectively. Impressions increased as "Conditions for increase in imps" while clicks increased as "conditions for increase in clicks". CTR was efficient by ${Math.abs(
                reportData.changePercentCTR
              )}% and was at ${reportData.additionalFieldsDayBeforeYesterday.total_ctr.toFixed(
                2
              )}% as we saw an improvement in the ad copy performance. Avg. CPC was efficient as competition lowered and was at t%. Cost increased by ${Math.abs(
                reportData.changePercentCost
              )}% as click volume increased.`;
              setInitialParagraph(initalParaText);
            }
          }
        } else if (
          reportData.totalAvgCPCYesterday >
          reportData.totalAvgCPCDayBeforeYesterday
        ) {
          if (
            reportData.totalCostYesterday >
            reportData.totalCostDayBeforeYesterday
          ) {
            if (
              reportData.totalCTRYesterday >
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `Both impressions and clicks increased by ${Math.abs(
                reportData.changePercentImpressions
              )}% and ${Math.abs(
                reportData.changePercentClicks
              )}% respectively. Impressions increased as "Conditions for increase in imps" while clicks increased as "conditions for increase in clicks". CTR was efficient by ${Math.abs(
                reportData.changePercentCTR
              )}% and was at ${
                reportData.additionalFieldsDayBeforeYesterday.total_ctr
              }% as we saw an improvement in the ad copy performance. Avg. CPC spiked as competition lowered and was at t%. This led cost to spike by ${Math.abs(
                reportData.changePercentCost
              )}%.`;
              setInitialParagraph(initalParaText);
            } else if (
              reportData.totalCTRYesterday <
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `Both impressions and clicks increased by ${Math.abs(
                reportData.changePercentImpressions
              )}% and ${Math.abs(
                reportData.changePercentClicks
              )}% respectively. Impressions increased as "Conditions for increase in imps" while clicks increased as "conditions for increase in clicks". CTR dropped by ${Math.abs(
                reportData.changePercentCTR
              )}% and was at ${
                reportData.additionalFieldsDayBeforeYesterday.total_ctr
              }% as the ad copy performance dropped. Avg. CPC spiked as competition lowered and was at t%. This led cost to spike by ${Math.abs(
                reportData.changePercentCost
              )}%%.`;
              setInitialParagraph(initalParaText);
            }
          } else if (
            reportData.totalCostYesterday >
            reportData.totalCostDayBeforeYesterday
          ) {
            if (
              reportData.totalCTRYesterday <
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `Both Impressions and clicks increased by ${Math.abs(
                reportData.changePercentImpressions
              )}% and ${Math.abs(
                reportData.changePercentClicks
              )}% respectively as "conditions for increase in impressions". Click volume increased as "conditions for increase in clicks". CTR was at ${reportData.additionalFieldsDayBeforeYesterday.total_ctr.toFixed(
                2
              )}% which was down by ${Math.abs(
                reportData.changePercentCTR
              )}%. Avg.CPC was efficient by x% due to a drop in competition. However, cost increased by ${
                reportData.changePercentCost
              }% as click volume increased. We received q leads yesterday with a CPL of Rs.123. The location which through which received the most clicks was "City". We received x leads from "City1" and y leads from "City2."`;
              setInitialParagraph(initalParaText);
            } else if (
              reportData.totalCTRYesterday >
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `Both impressions and clicks increased by ${Math.abs(
                reportData.changePercentImpressions
              )}% and ${Math.abs(
                reportData.changePercentClicks
              )}% respectively. Impressions increased as "Conditions for increase in imps" while clicks increased as "conditions for increase in clicks". CTR was efficient by ${Math.abs(
                reportData.changePercentCTR
              )}% and was at r% as we saw an improvement in the ad copy performance. Avg. CPC was efficient as competition lowered and was at t%. Cost increased by y% as click volume increased.`;
              setInitialParagraph(initalParaText);
            }
          }
        }
      } else if (
        reportData.totalClicksYesterday <
        reportData.totalClicksDayBeforeYesterday
      ) {
        if (
          reportData.totalAvgCPCYesterday >
          reportData.totalCostPerConvDayBeforeYesterday
        ) {
          if (
            reportData.totalCostYesterday <
            reportData.totalCostDayBeforeYesterday
          ) {
            if (
              reportData.totalCTRYesterday >
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `While impressions increased by ${Math.abs(
                reportData.changePercentImpressions
              )}%, click volume decreased ${Math.abs(
                reportData.changePercentClicks
              )}%. This led CTR to an efficient CTR of ${Math.abs(
                reportData.additionalFieldsYesterday.total_ctr
              )}% which improved by ${Math.abs(
                reportData.changePercentCTR
              )}%. Impression volume increased as "conditions". Clicks volume dropped as "comditions". Avg.CPC increased by ${Math.abs(
                reportData.changePercentAvgCPC
              )}% due to an aggreessive competition. Even though CPC spiked, spend dropped by ${Math.abs(
                reportData.changePercentCost
              )}% as click volume dropped. The location which through which received the most clicks was "City". We received x leads from "City1" and y leads from "City2."`;
              setInitialParagraph(initalParaText);
            } else if (
              reportData.totalCTRYesterday <
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `While impressions increased by ${Math.abs(
                reportData.changePercentImpressions
              )}%, click volume decreased ${Math.abs(
                reportData.changePercentClicks
              )}%. Impressions increased as "condition for increase in imps". Click volume decreased as "conditions for decrease in clicks". CTR dropped by ${
                reportData.changePercentCTR
              }% and was at ${
                reportData.additionalFieldsDayBeforeYesterday.total_ctr
              }% as the ad copy performance dropped.`;
              setInitialParagraph(initalParaText);
            }
          } else if (
            reportData.totalCostYesterday >
            reportData.totalCostDayBeforeYesterday
          ) {
            if (
              reportData.totalCTRYesterday >
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `While impressions increased by ${Math.abs(
                reportData.changePercentImpressions
              )}%, click volume decreased by ${Math.abs(
                reportData.changePercentClicks
              )}%. Impressions increased as "condition for increase in imps". Click volume decreased as "conditions for decrease in clicks". CTR was efficient by ${Math.abs(
                reportData.changePercentCTR
              )}% and was at ${Math.abs(
                reportData.additionalFieldsDayBeforeYesterday.total_ctr
              )}% as we saw an improvement in the ad copy performance. Avg. CPC spiked as competition lowered and was at ${
                reportData.additionalFieldsDayBeforeYesterday.total_avg_cpc
              }%. This led cost to spike by ${Math.abs(
                reportData.changePercentCost
              )}%.`;
              setInitialParagraph(initalParaText);
            } else if (
              reportData.totalCTRYesterday <
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `While impressions increased by ${Math.abs(
                reportData.changePercentImpressions
              )}%, click volume decreased by ${Math.abs(
                reportData.changePercentClicks
              )}%. Impressions increased as "condition for increase in imps". Click volume decreased as "conditions for decrease in clicks". CTR dropped by ${Math.abs(
                reportData.changePercentCTR
              )}% and was at ${Math.abs(
                reportData.additionalFieldsDayBeforeYesterday.total_ctr
              )}% as the ad copy performance dropped. Avg. CPC spiked as competition lowered and was at ${
                reportData.additionalFieldsDayBeforeYesterday.total_avg_cpc
              }%. This led cost to spike by ${Math.abs(
                reportData.changePercentCost
              )}%.`;
              setInitialParagraph(initalParaText);
            }
          }
        } else if (
          reportData.totalAvgCPCYesterday <
          reportData.totalCostPerConvDayBeforeYesterday
        ) {
          if (
            reportData.totalCostYesterday >
            reportData.totalCostDayBeforeYesterday
          ) {
            if (
              reportData.totalCTRYesterday >
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `While impressions increased by ${Math.abs(
                reportData.changePercentImpressions
              )}%, click volume decreased by ${Math.abs(
                reportData.changePercentClicks
              )}%. Impressions increased as "condition for increase in imps". Click volume decreased as "conditions for decrease in clicks". CTR was efficient by ${Math.abs(
                reportData.changePercentCTR
              )}% and was at ${Math.abs(
                reportData.additionalFieldsDayBeforeYesterday.total_ctr
              )}% as we saw an improvement in the ad copy performance. Avg. CPC was spiked as competition increased and was at ${
                reportData.additionalFieldsDayBeforeYesterday.total_avg_cpc
              }%. Cost decreased by ${Math.abs(
                reportData.changePercentCost
              )}% as click volume dropped.`;
              setInitialParagraph(initalParaText);
            } else if (
              reportData.totalCTRYesterday <
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `While impressions increased by ${Math.abs(
                reportData.changePercentImpressions
              )}%, click volume decreased by ${Math.abs(
                reportData.changePercentClicks
              )}%. Impressions increased as "condition for increase in imps". Click volume decreased as "conditions for decrease in clicks". CTR dropped by ${Math.abs(
                reportData.changePercentCTR
              )}% and was at ${Math.abs(
                reportData.additionalFieldsDayBeforeYesterday.total_ctr
              )}% as the ad copy performance dropped. Avg. CPC was spiked as competition increased and was at ${
                reportData.additionalFieldsDayBeforeYesterday.total_avg_cpc
              }%. Cost decreased by ${Math.abs(
                reportData.changePercentCost
              )}% as click volume dropped.`;
              setInitialParagraph(initalParaText);
            }
          } else if (
            reportData.totalCostYesterday >
            reportData.totalCostDayBeforeYesterday
          ) {
            if (
              reportData.totalCTRYesterday >
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `While impressions increased by ${Math.abs(
                reportData.changePercentImpressions
              )}%, click volume decreased by ${Math.abs(
                reportData.changePercentClicks
              )}%. Impressions increased as "condition for increase in imps". Click volume decreased as "conditions for decrease in clicks". CTR was efficient by ${Math.abs(
                reportData.changePercentCTR
              )}% and was at ${Math.abs(
                reportData.additionalFieldsDayBeforeYesterday.total_ctr
              )}% as we saw an improvement in the ad copy performance. Avg. CPC spiked as competition lowered and was at ${
                reportData.additionalFieldsDayBeforeYesterday.total_avg_cpc
              }%. This led cost to spike by ${Math.abs(
                reportData.changePercentCost
              )}%.`;
              setInitialParagraph(initalParaText);
            } else if (
              reportData.totalCTRYesterday <
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `While impressions increased by ${Math.abs(
                reportData.changePercentImpressions
              )}%, click volume decreased by ${Math.abs(
                reportData.changePercentClicks
              )}%. Impressions increased as "condition for increase in imps". Click volume decreased as "conditions for decrease in clicks". CTR dropped by ${Math.abs(
                reportData.changePercentCTR
              )}% and was at ${Math.abs(
                reportData.additionalFieldsDayBeforeYesterday.total_ctr
              )}% as the ad copy performance dropped. Avg. CPC spiked as competition lowered and was at ${
                reportData.additionalFieldsDayBeforeYesterday.total_avg_cpc
              }%. This led cost to spike by ${Math.abs(
                reportData.changePercentCost
              )}%.`;
              setInitialParagraph(initalParaText);
            }
          }
        }
      } else if (
        reportData.totalClicksYesterday ===
        reportData.totalClicksDayBeforeYesterday
      ) {
        if (
          reportData.totalAvgCPCYesterday <
          reportData.totalCostPerConvDayBeforeYesterday
        ) {
          if (
            reportData.totalCostYesterday <
            reportData.totalCostDayBeforeYesterday
          ) {
            if (
              reportData.totalCTRYesterday <
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `While we saw a decrease in impression volume by ${Math.abs(
                reportData.changePercentImpressions
              )}%, click traffic increased by ${Math.abs(
                reportData.changePercentClicks
              )}%. Impressions dropped as "". Click volume increased as"".Avg. CPC was efficient by a% and was at $q as we saw lower competition. However, cost decreased as click volume decreased DoD.`;
              setInitialParagraph(initalParaText);
            }
          }
        }
      }
    }

    if (
      reportData.totalImpressionsYesterday <
      reportData.totalImpressionsDayBeforeYesterday
    ) {
      if (
        reportData.totalClicksYesterday <
        reportData.totalClicksDayBeforeYesterday
      ) {
        if (
          reportData.totalAvgCPCYesterday >
          reportData.totalAvgCPCDayBeforeYesterday
        ) {
          if (
            reportData.totalCostYesterday <
            reportData.totalCostDayBeforeYesterday
          ) {
            if (
              reportData.totalCTRYesterday <
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `Both Impressions and clicks decreased by ${Math.abs(
                reportData.changePercentImpressions
              )}% and ${Math.abs(
                reportData.changePercentClicks
              )}% respectively as "conditions for decrease in impressions". Click volume decreased as "conditions for decrease in clicks". CTR was at x% which was down/up by z%. Avg.CPC increased by x% due to an aggreessive competition. This led overall cost to be reduced by t%. We received q leads yesterday with a CPL of Rs.123. The location which through which received the most clicks was "City". We received x leads from "City1" and y leads from "City2."`;
              setInitialParagraph(initalParaText);
            } else if (
              reportData.totalCTRYesterday >
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `Both Impressions and clicks decreased by ${Math.abs(
                reportData.changePercentImpressions
              )}% and ${Math.abs(
                reportData.changePercentClicks
              )}% respectively as "conditions for decrease in impressions". Click volume decreased as "conditions for decrease in clicks". CTR was at ${reportData.additionalFieldsDayBeforeYesterday.total_ctr.toFixed(
                2
              )} which was up by ${Math.abs(
                reportData.changePercentCTR
              )}%. Avg.CPC increased by ${Math.abs(
                reportData.changePercentAvgCPC
              )}% due to an aggreessive competition. However, cost decreased by ${Math.abs(
                reportData.changePercentCost
              )}% as click volume dropped. We received q leads yesterday with a CPL of Rs.123. The location which through which received the most clicks was "City". We received x leads from "City1" and y leads from "City2."`;
              setInitialParagraph(initalParaText);
            }
          } else if (
            reportData.totalCostYesterday >
            reportData.totalCostDayBeforeYesterday
          ) {
            if (
              reportData.totalCTRYesterday <
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `Both Impressions and clicks decreased by ${Math.abs(
                reportData.changePercentImpressions
              )}% and ${Math.abs(
                reportData.changePercentClicks
              )}% respectively as "conditions for decrease in impressions". Click volume decreased as "conditions for decrease in clicks". CTR was at x% which was down/up by z%. Avg.CPC increased by x% due to an aggreessive competition. However, cost increased by t% as avg.CPC spiked. We received q leads yesterday with a CPL of Rs.123. The location which through which received the most clicks was "City". We received x leads from "City1" and y leads from "City2."`;
              setInitialParagraph(initalParaText);
            } else if (
              reportData.totalCTRYesterday >
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `Both impressions and clicks decreased by ${Math.abs(
                reportData.changePercentImpressions
              )}% and ${Math.abs(
                reportData.changePercentClicks
              )}% respectively. Impression volume dropped as "Budget Decreased IF NOT User search volume decreased for Brand keywords IF NOT Non brand keywords". Clicks decreased as "drop in avg. position of ad copy IF NOT poor ad copy performance". CTR was efficient by ${Math.abs(
                reportData.changePercentCTR
              )}% and was at ${
                reportData.additionalFieldsDayBeforeYesterday.total_ctr
              }% as we saw an improvement in the ad copy performance. Avg. CPC spiked as competition lowered and was at ${
                reportData.additionalFieldsDayBeforeYesterday.total_avg_cpc
              }%. This led cost to spike by ${Math.abs(
                reportData.changePercentCost
              )}%.`;
              setInitialParagraph(initalParaText);
            }
          }
        } else if (
          reportData.totalAvgCPCYesterday <
          reportData.totalAvgCPCDayBeforeYesterday
        ) {
          if (
            reportData.totalCostYesterday <
            reportData.totalCostDayBeforeYesterday
          ) {
            if (
              reportData.totalCTRYesterday >
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `Both Impressions and clicks decreased by ${Math.abs(
                reportData.changePercentImpressions
              )}% and ${Math.abs(
                reportData.changePercentClicks
              )}% respectively as "conditions for decrease in impressions". Click volume decreased as "conditions for decrease in clicks". CTR was at x% which was up by z%. Avg. CPC was efficient by a% and was at $q as we saw lower competition. This led overall cost to be reduced by t%. We received q leads yesterday with a CPL of Rs.123. The location which through which received the most clicks was "City". We received x leads from "City1" and y leads from "City2."`;
              setInitialParagraph(initalParaText);
            } else if (
              reportData.totalCTRYesterday <
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `Both impressions and clicks decreased by ${Math.abs(
                reportData.changePercentImpressions
              )}% and ${Math.abs(
                reportData.changePercentClicks
              )}% respectively. Impression volume dropped as "Budget Decreased IF NOT User search volume decreased for Brand keywords IF NOT Non brand keywords". Clicks decreased as "drop in avg. position of ad copy IF NOT poor ad copy performance". CTR dropped by ${Math.abs(
                reportData.changePercentCTR
              )}% and was at ${reportData.additionalFieldsDayBeforeYesterday.total_ctr.toFixed(
                2
              )}% as the ad copy performance dropped. Avg. CPC was efficient as competition lowered and was at ${
                reportData.additionalFieldsDayBeforeYesterday.total_avg_cpc
              }%. This led cost to decrease by ${Math.abs(
                reportData.changePercentCost
              )}%.`;
              setInitialParagraph(initalParaText);
            }
          } else if (
            reportData.totalCostYesterday >
            reportData.totalCostDayBeforeYesterday
          ) {
            if (
              reportData.totalCTRYesterday <
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `Both Impressions and clicks decreased by ${Math.abs(
                reportData.changePercentImpressions
              )}% and ${Math.abs(
                reportData.changePercentClicks
              )}% respectively as "conditions for decrease in impressions". Click volume decreased as "conditions for decrease in clicks". CTR was at ${
                reportData.additionalFieldsDayBeforeYesterday.total_ctr
              } which was down/up by ${
                reportData.changePercentCTR
              }%. Avg.CPC increased by x% due to an aggreessive competition. However, cost increased by t% as avg.CPC spiked. We received q leads yesterday with a CPL of Rs.123. The location which through which received the most clicks was "City". We received x leads from "City1" and y leads from "City2."`;
              setInitialParagraph(initalParaText);
            } else if (
              reportData.totalCTRYesterday >
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `Both impressions and clicks decreased by ${Math.abs(
                reportData.changePercentImpressions
              )}% and ${Math.abs(
                reportData.changePercentClicks
              )}% respectively. Impression volume dropped as "Budget Decreased IF NOT User search volume decreased for Brand keywords IF NOT Non brand keywords". Clicks decreased as "drop in avg. position of ad copy IF NOT poor ad copy performance". CTR was efficient by ${Math.abs(
                reportData.changePercentCTR
              )}% and was at ${
                reportData.additionalFieldsDayBeforeYesterday.total_ctr
              }% as we saw an improvement in the ad copy performance. Avg. CPC was spiked as competition increased and was at ${
                reportData.additionalFieldsDayBeforeYesterday.total_avg_cpc
              }%. Cost decreased by ${Math.abs(
                reportData.changePercentCost
              )}% as click volume dropped.`;
              setInitialParagraph(initalParaText);
            }
          }
        }
      } else if (
        reportData.totalClicksYesterday >
        reportData.totalClicksDayBeforeYesterday
      ) {
        if (
          reportData.totalAvgCPCYesterday <
          reportData.totalAvgCPCDayBeforeYesterday
        ) {
          if (
            reportData.totalCostYesterday >
            reportData.totalCostDayBeforeYesterday
          ) {
            if (
              reportData.totalCTRYesterday >
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `Even though impressions saw a drop by ${Math.abs(
                reportData.changePercentImpressions
              )}%, clicks increased by ${Math.abs(
                reportData.changePercentClicks
              )}%. This led CTR to increase by t% and was at y%. Impression volume decreased as "conditions for decrease in impressions". Click volume increased as "conditions for increase in clicks". Avg. CPC was efficient by a% and was at $q as we saw lower competition. However, cost increased as click volume increased DoD. The location which through which received the most clicks was "City". We received x leads from "City1" and y leads from "City2."`;
              setInitialParagraph(initalParaText);
            }
          } else if (
            reportData.totalCostYesterday <
            reportData.totalCostDayBeforeYesterday
          ) {
            if (
              reportData.totalCTRYesterday <
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `While impressions decreased by ${Math.abs(
                reportData.changePercentImpressions
              )}%, click volume improved by ${Math.abs(
                reportData.changePercentClicks
              )}%. Clicks increased as "increase in avg. position of ad copy IF NOT good ad copy performance". Impression volume dropped as "Budget Decreased IF NOT User search volume decreased for Brand keywords IF NOT Non brand keywords". CTR dropped by ${Math.abs(
                reportData.changePercentCTR
              )}% and was at ${
                reportData.additionalFieldsDayBeforeYesterday.total_ctr
              }% as the ad copy performance dropped. Avg. CPC was efficient as competition lowered and was at ${
                reportData.additionalFieldsDayBeforeYesterday.total_avg_cpc
              }%. This led cost to decrease by ${Math.abs(
                reportData.changePercentCost
              )}%.`;
              setInitialParagraph(initalParaText);
            } else if (
              reportData.totalCTRYesterday >
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `While impressions decreased by ${Math.abs(
                reportData.changePercentImpressions
              )}%, click volume improved by ${Math.abs(
                reportData.changePercentClicks
              )}%. Clicks increased as "increase in avg. position of ad copy IF NOT good ad copy performance". Impression volume dropped as "Budget Decreased IF NOT User search volume decreased for Brand keywords IF NOT Non brand keywords". CTR was efficient by ${Math.abs(
                reportData.changePercentCTR
              )}% and was at ${
                reportData.additionalFieldsDayBeforeYesterday.total_ctr
              }% as we saw an improvement in the ad copy performance. Avg. CPC was efficient as competition lowered and was at ${
                reportData.additionalFieldsDayBeforeYesterday.total_avg_cpc
              }%. This led cost to decrease by ${Math.abs(
                reportData.changePercentCost
              )}%.`;
              setInitialParagraph(initalParaText);
            }
          }
        } else if (
          reportData.totalAvgCPCYesterday >
          reportData.totalAvgCPCDayBeforeYesterday
        ) {
          if (
            reportData.totalCostYesterday >
            reportData.totalCostDayBeforeYesterday
          ) {
            if (
              reportData.totalCTRYesterday >
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `Even though impressions saw a drop by ${Math.abs(
                reportData.changePercentImpressions
              )}%, clicks increased by ${Math.abs(
                reportData.changePercentClicks
              )}%. This led CTR to increase by t% and was at y%. Impression volume decreased as "conditions for decrease in impressions". Click volume increased as "conditions for increase in clicks". Avg. CPC was efficient by a% and was at $q as we saw lower competition. However, cost increased as click volume increased DoD. The location which through which received the most clicks was "City". We received x leads from "City1" and y leads from "City2."`;
              setInitialParagraph(initalParaText);
            }
          } else if (
            reportData.totalCostYesterday <
            reportData.totalCostDayBeforeYesterday
          ) {
            if (
              reportData.totalCTRYesterday <
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `While impressions decreased by ${Math.abs(
                reportData.changePercentImpressions
              )}%, click volume improved by ${Math.abs(
                reportData.changePercentClicks
              )}%. Clicks increased as "increase in avg. position of ad copy IF NOT good ad copy performance". Impression volume dropped as "Budget Decreased IF NOT User search volume decreased for Brand keywords IF NOT Non brand keywords". CTR dropped by ${Math.abs(
                reportData.changePercentCTR
              )}% and was at ${
                reportData.additionalFieldsDayBeforeYesterday.total_ctr
              }% as the ad copy performance dropped.`;
              setInitialParagraph(initalParaText);
            } else if (
              reportData.totalCTRYesterday >
              reportData.totalCTRDayBeforeYesterday
            ) {
              initalParaText += `While impressions decreased by ${Math.abs(
                reportData.changePercentImpressions
              )}%, click volume improved by ${Math.abs(
                reportData.changePercentClicks
              )}%. Clicks increased as "increase in avg. position of ad copy IF NOT good ad copy performance". Impression volume dropped as "Budget Decreased IF NOT User search volume decreased for Brand keywords IF NOT Non brand keywords". CTR was efficient by ${Math.abs(
                reportData.changePercentCTR
              )}% and was at ${
                reportData.additionalFieldsDayBeforeYesterday.total_ctr
              }% as we saw an improvement in the ad copy performance. Avg. CPC was efficient as competition lowered and was at ${
                reportData.additionalFieldsDayBeforeYesterday.total_avg_cpc
              }%. This led cost to decrease by ${Math.abs(
                reportData.changePercentCost
              )}%.`;
              setInitialParagraph(initalParaText);
            }
          }
        }
      }
    }
    setInitialParagraph(initalParaText);
  }
};
