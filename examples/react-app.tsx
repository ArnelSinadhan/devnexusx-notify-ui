import { NotifyProvider, useNotify } from "@devnexusx/notify-ui/react";
// ─── 1. Wrap your app with the Provider ───────────────────────

function App() {
  return (
    <NotifyProvider
      config={{
        position: "top-right",
        duration: 4000,
        theme: "light",
        maxVisible: 5,
      }}
    >
      <Dashboard />
    </NotifyProvider>
  );
}

// ─── 2. Use the hook in any component ─────────────────────────

function Dashboard() {
  const { showSuccess, showError, showWarning, showInfo, confirm, toast } =
    useNotify();

  const handleSave = async () => {
    try {
      // await api.saveProfile(data);
      showSuccess("Profile saved!");
    } catch {
      showError("Failed to save profile.");
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      message: "This action cannot be undone.",
      title: "Delete project?",
      confirmText: "Delete",
      cancelText: "Cancel",
    });

    if (confirmed) {
      showSuccess("Project deleted");
    }
  };

  const handleCustom = () => {
    toast({
      message: "",
      type: "info",
      html: "<strong>Custom HTML</strong> inside a toast!",
      position: "bottom-center",
      animation: "bounce",
      theme: "dark",
      duration: 6000,
    });
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => showSuccess("It worked!")}>Success</button>
        <button onClick={() => showError("Something broke")}>Error</button>
        <button onClick={() => showWarning("Watch out!")}>Warning</button>
        <button onClick={() => showInfo("FYI")}>Info</button>
        <button onClick={handleSave}>Save Profile</button>
        <button onClick={handleDelete}>Delete Project</button>
        <button onClick={handleCustom}>Custom Toast</button>
      </div>
    </div>
  );
}

// ─── 3. Alternative: Standalone hook (no Provider) ────────────

import { useNotifyStandalone } from "@devnexusx/notify-ui/react";

function QuickComponent() {
  const notify = useNotifyStandalone({
    theme: "dark",
    position: "bottom-right",
  });

  return (
    <button onClick={() => notify.showSuccess("Quick and easy!")}>
      Notify
    </button>
  );
}

export default App;
