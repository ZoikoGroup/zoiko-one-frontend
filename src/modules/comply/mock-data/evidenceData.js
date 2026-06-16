export function getEvidence() {
  const evidence = [];
  const categories = ["screenshot", "document", "log", "report", "configuration", "certification"];
  const statuses = ["uploaded", "reviewed", "expiring", "expired", "rejected"];
  const sourceProducts = ["AWS CloudTrail", "Azure Security Center", "Datadog", "Splunk", "Jira", "Confluence", "GitLab", "SonarQube", "Nessus", "Qualys", "CrowdStrike", "Okta", "Terraform", "Kubernetes", "Docker", "Jenkins", "Snyk", "Hashicorp Vault", "ServiceNow", "SailPoint"];

  const controlCodes = ["AC-1","AC-2","AC-3","AC-4","AC-5","AC-6","AC-7","AU-1","AU-2","AU-3","AU-4","AU-5","AU-6","CM-1","CM-2","CM-3","IR-1","IR-2","IR-3","MP-1","MP-2","PS-1","PS-2","RA-1","RA-2","RA-3","SA-1","SA-2","SC-1","SC-2","SC-3","SC-4","SC-5","SC-6","SC-7","SC-8","SI-1","SI-2","SI-3","SI-4"];

  for (let i = 1; i <= 500; i++) {
    const category = categories[i % categories.length];
    const status = statuses[i % statuses.length];
    const source = sourceProducts[i % sourceProducts.length];
    const control = controlCodes[i % controlCodes.length];

    const createdDate = new Date(2025, 0, 1);
    createdDate.setDate(createdDate.getDate() + Math.floor(Math.random() * 500));

    const expiryDate = new Date(createdDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    evidence.push({
      id: i,
      title: `Evidence Record ${i} - ${control} Control Testing`,
      controlCode: control,
      category,
      sourceProduct: source,
      status: i < 480 ? (i < 400 ? status : "reviewed") : (i < 490 ? "expiring" : "expired"),
      uploadedBy: ["Sarah Chen", "Mike Johnson", "Anna Petrova", "David Chen", "Alex Rivera"][i % 5],
      uploadedDate: createdDate.toISOString().split("T")[0],
      expiryDate: expiryDate.toISOString().split("T")[0],
      fileSize: `${(Math.random() * 10 + 0.1).toFixed(1)} MB`,
      fileType: [".pdf", ".png", ".csv", ".json", ".xml", ".docx"][i % 6],
      tags: [`control-${control}`, category, `audit-${(i % 10) + 1}`, "soc2", "iso27001"],
      description: `Evidence for ${control} control testing - ${category} from ${source} - Cycle ${(i % 4) + 1}`,
      version: `1.${Math.floor(i / 50)}`,
    });
  }
  return evidence;
}

export function getEvidenceSummary() {
  const evidence = getEvidence();
  return {
    total: evidence.length,
    byStatus: {
      uploaded: evidence.filter(e => e.status === "uploaded").length,
      reviewed: evidence.filter(e => e.status === "reviewed").length,
      expiring: evidence.filter(e => e.status === "expiring").length,
      expired: evidence.filter(e => e.status === "expired").length,
      rejected: evidence.filter(e => e.status === "rejected").length,
    },
    byCategory: {
      screenshot: evidence.filter(e => e.category === "screenshot").length,
      document: evidence.filter(e => e.category === "document").length,
      log: evidence.filter(e => e.category === "log").length,
      report: evidence.filter(e => e.category === "report").length,
      configuration: evidence.filter(e => e.category === "configuration").length,
      certification: evidence.filter(e => e.category === "certification").length,
    },
    expiringSoon: evidence.filter(e => e.status === "expiring" || e.status === "expired").length,
  };
}
