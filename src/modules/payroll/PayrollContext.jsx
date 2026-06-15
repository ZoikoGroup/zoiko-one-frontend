import { createContext, useContext, useState, useEffect } from "react";

const PayrollContext = createContext();

const initialEmployees = [
  {
    id: "EMP-0001",
    name: "Arjun Nair",
    dept: "Engineering",
    type: "Full-time",
    salary: 120000,
    status: "Active",
    ready: true,
    pan: "ABCDE1234F",
    bankName: "HDFC Bank",
    bankAcc: "4821",
    bankIfsc: "HDFC0001234",
    bankType: "Savings"
  },
  {
    id: "EMP-0002",
    name: "Priya Sharma",
    dept: "Marketing",
    type: "Full-time",
    salary: 95000,
    status: "Active",
    ready: true,
    pan: "ABCDE5678G",
    bankName: "HDFC Bank",
    bankAcc: "9988",
    bankIfsc: "HDFC0001234",
    bankType: "Savings"
  },
  {
    id: "EMP-0003",
    name: "Rohit Kumar",
    dept: "Finance",
    type: "Contract",
    salary: 75000,
    status: "Active",
    ready: false,
    pan: "",
    bankName: "ICICI Bank",
    bankAcc: "1122",
    bankIfsc: "ICIC0007703",
    bankType: "Current"
  },
  {
    id: "EMP-0004",
    name: "Sneha Patel",
    dept: "HR",
    type: "Full-time",
    salary: 88000,
    status: "Active",
    ready: true,
    pan: "ABCDE9911X",
    bankName: "Axis Bank",
    bankAcc: "3344",
    bankIfsc: "UTIB0000123",
    bankType: "Savings"
  },
  {
    id: "EMP-0005",
    name: "Vikram Singh",
    dept: "Sales",
    type: "Full-time",
    salary: 105000,
    status: "On Leave",
    ready: true,
    pan: "ABCDE2233Y",
    bankName: "SBI Bank",
    bankAcc: "5566",
    bankIfsc: "SBIN0001234",
    bankType: "Savings"
  },
  {
    id: "EMP-0006",
    name: "Ananya Joshi",
    dept: "Engineering",
    type: "Full-time",
    salary: 135000,
    status: "Active",
    ready: false,
    pan: "ABCDE8822Z",
    bankName: "",
    bankAcc: "",
    bankIfsc: "",
    bankType: ""
  },
  {
    id: "EMP-0007",
    name: "Ravi Menon",
    dept: "Design",
    type: "Part-time",
    salary: 55000,
    status: "Active",
    ready: true,
    pan: "ABCDE7744K",
    bankName: "HDFC Bank",
    bankAcc: "2211",
    bankIfsc: "HDFC0001234",
    bankType: "Savings"
  }
];

const initialRuns = [
  {
    id: "PR-0042",
    period: "Jun 1–15, 2026",
    payDate: "2026-06-15",
    employees: 1248,
    gross: "₹84,23,000",
    net: "₹63,18,000",
    status: "Review"
  },
  {
    id: "PR-0041",
    period: "May 16–31, 2026",
    payDate: "2026-05-31",
    employees: 1235,
    gross: "₹82,14,000",
    net: "₹61,80,000",
    status: "Closed"
  },
  {
    id: "PR-0040",
    period: "May 1–15, 2026",
    payDate: "2026-05-15",
    employees: 1230,
    gross: "₹80,50,000",
    net: "₹60,40,000",
    status: "Paid"
  },
  {
    id: "PR-0039",
    period: "Apr 16–30, 2026",
    payDate: "2026-04-30",
    employees: 1218,
    gross: "₹78,90,000",
    net: "₹59,10,000",
    status: "Closed"
  }
];

const initialExceptions = [
  {
    id: "EXC-001",
    employee: "Rohit Kumar",
    issue: "Missing PAN / Tax ID",
    impact: "Cannot calculate TDS",
    type: "hard",
    empId: "EMP-0003"
  },
  {
    id: "EXC-002",
    employee: "Ananya Joshi",
    issue: "Invalid bank account details",
    impact: "Payment will fail",
    type: "hard",
    empId: "EMP-0006"
  },
  {
    id: "WRN-001",
    employee: "Vikram Singh",
    issue: "Overtime spike — 45 hrs overtime this period",
    impact: "Gross pay increased by 18%",
    type: "warning",
    empId: "EMP-0005"
  },
  {
    id: "WRN-002",
    employee: "Priya Sharma",
    issue: "Large pay variance vs. last period",
    impact: "Net pay changed by +12%",
    type: "warning",
    empId: "EMP-0002"
  },
  {
    id: "WRN-003",
    employee: "Deepak Reddy",
    issue: "Terminated employee included in run",
    impact: "Review required before proceeding",
    type: "warning"
  },
  {
    id: "WRN-004",
    employee: "Karan Mehta",
    issue: "ESI deduction calculation mismatch",
    impact: "Difference of ₹120",
    type: "warning"
  },
  {
    id: "WRN-005",
    employee: "Sunita Rao",
    issue: "Leave encashment not configured",
    impact: "Payout pending configuration",
    type: "warning"
  }
];

const initialApprovalStages = [
  {
    role: "Payroll Manager",
    person: "Meera Iyer",
    action: "Submit for Review",
    status: "done",
    time: "Jun 12, 2026 · 10:42 AM"
  },
  {
    role: "Finance Approver",
    person: "Rajesh Bose",
    action: "Approve Payroll",
    status: "pending",
    time: null
  },
  {
    role: "Payment Authorizer",
    person: "Sunita Nair",
    action: "Authorize Payment",
    status: "locked",
    time: null
  }
];

const initialPaymentBatches = [
  {
    id: "PB-0042",
    run: "PR-0042",
    employees: 1248,
    amount: "₹63,18,000",
    status: "Pending",
    created: "Jun 14, 2026"
  },
  {
    id: "PB-0041",
    run: "PR-0041",
    employees: 1235,
    amount: "₹61,80,000",
    status: "Paid",
    created: "May 30, 2026"
  },
  {
    id: "PB-0040",
    run: "PR-0040",
    employees: 1230,
    amount: "₹60,40,000",
    status: "Paid",
    created: "May 14, 2026"
  },
  {
    id: "PB-0038",
    run: "PR-0038",
    employees: 10,
    amount: "₹2,50,000",
    status: "Failed",
    created: "Apr 10, 2026"
  }
];

export function PayrollProvider({ children }) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [runs, setRuns] = useState(initialRuns);
  const [exceptions, setExceptions] = useState(initialExceptions);
  const [approvalStages, setApprovalStages] = useState(initialApprovalStages);
  const [paymentBatches, setPaymentBatches] = useState(initialPaymentBatches);
  const [toasts, setToasts] = useState([]);
  
  const [settings, setSettings] = useState({
    offCycle: true,
    autoCalc: true,
    dualControl: true,
    auditLog: true,
    employeePayslip: true,
    emailNotifs: false,
    slackNotifs: false,
    aiAssistant: true,
  });

  const [companyDetails, setCompanyDetails] = useState({
    name: "Zoiko Technologies Pvt. Ltd.",
    type: "Private Limited Company",
    taxNo: "27AABCZ1234M1ZX",
    employerId: "EMP-IN-MH-00123",
    address: "Bandra Kurla Complex, Mumbai",
    industry: "Software / Technology",
    schedule: "semi-monthly",
    payDateRule: "Last working day of month",
    offCyclePayroll: "Enabled",
    bankName: "HDFC Bank",
    bankAcc: "4821",
    bankIfsc: "HDFC0001234",
    bankType: "Current",
    settlementBank: "ICICI Bank",
    settlementAcc: "7703",
    jurisdictionCountry: "India",
    jurisdictionState: "Maharashtra",
    compliancePack: "India Standard v2.1"
  });

  const [checklist, setChecklist] = useState([
    { id: "chk-name", label: "Company name & legal entity", done: true },
    { id: "chk-tax", label: "Tax registration number", done: true },
    { id: "chk-empId", label: "Employer ID registered", done: true },
    { id: "chk-sched", label: "Payroll schedule configured", done: true },
    { id: "chk-bank", label: "Payroll bank account linked", done: true },
    { id: "chk-settle", label: "Settlement account verified", done: false },
    { id: "chk-juris", label: "Jurisdiction & compliance pack selected", done: true },
    { id: "chk-stateTax", label: "State tax details entered", done: false }
  ]);

  const addToast = (message, type = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Re-evaluate checklist and employee readiness
  useEffect(() => {
    // Check if settlement bank and account are entered to complete "chk-settle"
    const hasSettle = companyDetails.settlementBank && companyDetails.settlementAcc;
    // Check state details for "chk-stateTax"
    const hasStateTax = companyDetails.jurisdictionState && companyDetails.compliancePack;

    setChecklist((prev) =>
      prev.map((c) => {
        if (c.id === "chk-settle") return { ...c, done: !!hasSettle };
        if (c.id === "chk-stateTax") return { ...c, done: !!hasStateTax };
        return c;
      })
    );
  }, [companyDetails]);

  // Sync employee ready state based on bank / tax info
  const checkEmployeeReadiness = (emp) => {
    return !!(emp.pan && emp.bankName && emp.bankAcc);
  };

  const addEmployee = (newEmp) => {
    const id = `EMP-00${employees.length + 1}`;
    const emp = {
      ...newEmp,
      id,
      ready: checkEmployeeReadiness(newEmp),
      status: newEmp.status || "Active"
    };
    setEmployees((prev) => [...prev, emp]);
    addToast(`Employee ${emp.name} added successfully!`, "success");
  };

  const updateEmployee = (id, updatedFields) => {
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const merged = { ...e, ...updatedFields };
          merged.ready = checkEmployeeReadiness(merged);
          return merged;
        }
        return e;
      })
    );

    // If updating Rohits PAN or Ananya's Bank Details, clear exceptions automatically!
    if (id === "EMP-0003" && updatedFields.pan) {
      setExceptions((prev) => prev.filter((exc) => exc.id !== "EXC-001"));
      addToast("PAN Tax ID updated. Exception EXC-001 resolved!", "success");
    }
    if (id === "EMP-0006" && updatedFields.bankName && updatedFields.bankAcc) {
      setExceptions((prev) => prev.filter((exc) => exc.id !== "EXC-002"));
      addToast("Bank details updated. Exception EXC-002 resolved!", "success");
    }
  };

  // Resolve exception directly
  const resolveException = (excId) => {
    const exc = exceptions.find((e) => e.id === excId);
    if (!exc) return;

    if (excId === "EXC-001") {
      // Missing PAN for Rohit
      updateEmployee("EMP-0003", { pan: "ABCDE1122Q" });
    } else if (excId === "EXC-002") {
      // Missing bank for Ananya
      updateEmployee("EMP-0006", {
        bankName: "HDFC Bank",
        bankAcc: "7766",
        bankIfsc: "HDFC0001234",
        bankType: "Savings"
      });
    } else {
      // Simple warnings
      setExceptions((prev) => prev.filter((e) => e.id !== excId));
      addToast(`Warning ${excId} acknowledged.`, "info");
    }
  };

  // Create a new run draft from wizard
  const createRunDraft = (scheduleType, periodText, payDateText) => {
    // Calculate totals based on current employees
    let totalGross = 0;
    let totalTaxes = 0;
    let totalDeductions = 0;
    let totalNet = 0;

    employees.forEach((emp) => {
      if (emp.status === "Active" || emp.status === "On Leave") {
        const salary = parseFloat(emp.salary) || 0;
        const gross = salary; // base
        const tax = Math.round(gross * 0.1); // 10% TDS
        const pf = Math.round(gross * 0.12); // 12% PF
        const esi = Math.round(gross * 0.0075); // 0.75% ESI
        const pt = 200; // PT
        const ded = pf + esi + pt;
        const net = gross - (tax + ded);

        totalGross += gross;
        totalTaxes += tax;
        totalDeductions += ded;
        totalNet += net;
      }
    });

    const runId = `PR-00${runs.length + 1}`;
    const newRun = {
      id: runId,
      period: periodText,
      payDate: payDateText,
      employees: employees.length,
      gross: `₹${(totalGross / 100000).toFixed(2)}L`,
      net: `₹${(totalNet / 100000).toFixed(2)}L`,
      status: "Review"
    };

    setRuns((prev) => [newRun, ...prev]);

    // Create approvals
    setApprovalStages([
      {
        role: "Payroll Manager",
        person: "Meera Iyer",
        action: "Submit for Review",
        status: "done",
        time: new Date().toLocaleString()
      },
      {
        role: "Finance Approver",
        person: "Rajesh Bose",
        action: "Approve Payroll",
        status: "pending",
        time: null
      },
      {
        role: "Payment Authorizer",
        person: "Sunita Nair",
        action: "Authorize Payment",
        status: "locked",
        time: null
      }
    ]);

    // Create payment batch
    const newBatch = {
      id: `PB-00${runs.length + 1}`,
      run: runId,
      employees: employees.length,
      amount: `₹${(totalNet / 100000).toFixed(2)}L`,
      status: "Pending",
      created: new Date().toLocaleDateString()
    };
    setPaymentBatches((prev) => [newBatch, ...prev]);

    addToast(`Payroll Run ${runId} created successfully!`, "success");
    return runId;
  };

  // Sign off an approval stage
  const approveStage = (idx) => {
    setApprovalStages((prev) => {
      const updated = prev.map((s, i) => {
        if (i === idx) {
          return { ...s, status: "done", time: new Date().toLocaleString() };
        }
        if (i === idx + 1 && s.status === "locked") {
          return { ...s, status: "pending" };
        }
        return s;
      });

      // If the last stage is approved, update active run status to Authorized
      const allApproved = updated.every((s) => s.status === "done");
      if (allApproved) {
        setRuns((prevRuns) =>
          prevRuns.map((r, ri) => (ri === 0 ? { ...r, status: "Authorized" } : r))
        );
        addToast("Payroll fully authorized for payment release!", "success");
      } else {
        addToast(`Approval stage completed: ${prev[idx].role}`, "success");
      }

      return updated;
    });
  };

  // Release payments for active run
  const releasePayments = (batchId) => {
    setPaymentBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, status: "Processing" } : b))
    );

    setTimeout(() => {
      setPaymentBatches((prev) =>
        prev.map((b) => (b.id === batchId ? { ...b, status: "Paid" } : b))
      );
      // Mark matching run as Paid
      setRuns((prevRuns) =>
        prevRuns.map((r, ri) => (ri === 0 ? { ...r, status: "Paid" } : r))
      );
      addToast(`Payment batch ${batchId} released successfully!`, "success");
    }, 2000);
  };

  return (
    <PayrollContext.Provider
      value={{
        employees,
        runs,
        setRuns,
        exceptions,
        approvalStages,
        paymentBatches,
        settings,
        companyDetails,
        checklist,
        toasts,
        setSettings,
        setCompanyDetails,
        addEmployee,
        updateEmployee,
        resolveException,
        createRunDraft,
        approveStage,
        releasePayments,
        addToast,
        removeToast
      }}
    >
      {children}
    </PayrollContext.Provider>
  );
}

export function usePayroll() {
  return useContext(PayrollContext);
}
