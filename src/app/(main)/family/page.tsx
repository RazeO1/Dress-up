"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Users, Copy, LogIn, Crown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";

interface FamilyGroup {
  id: string;
  name: string;
  invite_code: string;
  family_members: Array<{
    user_id: string;
    role: string;
    profiles?: { full_name: string; avatar_url: string | null };
  }>;
}

export default function FamilyPage() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["family-groups"],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase.from("family_groups").select(`
        *,
        family_members (
          user_id,
          role,
          profiles (id, full_name, avatar_url)
        )
      `);
      return (data || []) as FamilyGroup[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch("/api/family", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["family-groups"] });
      setShowCreate(false);
      setNewGroupName("");
    },
  });

  const joinMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await fetch("/api/family/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invite_code: code }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["family-groups"] });
      setShowJoin(false);
      setJoinCode("");
    },
  });

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Family</h1>
          <p className="text-text-secondary">Share outfits with family & friends</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowJoin(true)}>
            <LogIn size={18} className="mr-2" />
            Join
          </Button>
          <Button onClick={() => setShowCreate(true)}>
            <Plus size={18} className="mr-2" />
            Create
          </Button>
        </div>
      </header>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-bg-secondary rounded-card animate-pulse" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-16">
          <Users size={48} className="mx-auto mb-4 text-text-tertiary" />
          <p className="text-text-secondary mb-2">No family groups yet</p>
          <p className="text-sm text-text-tertiary">Create a group or join one with an invite code</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">{group.name}</h3>
                  <button
                    onClick={() => copyCode(group.invite_code)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-secondary rounded-full text-sm"
                  >
                    <span className="font-mono font-bold">{group.invite_code}</span>
                    <Copy size={14} />
                    {copied === group.invite_code && <span className="text-green-500 text-xs">Copied!</span>}
                  </button>
                </div>

                <div className="space-y-2">
                  {group.family_members.map((member) => (
                    <div key={member.user_id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center">
                        {member.profiles?.avatar_url ? (
                          <img src={member.profiles.avatar_url} alt="" className="w-full h-full rounded-full" />
                        ) : (
                          <span className="text-xs font-bold">
                            {member.profiles?.full_name?.[0] || "?"}
                          </span>
                        )}
                      </div>
                      <span className="text-sm">{member.profiles?.full_name || "Unknown"}</span>
                      {member.role === "owner" && (
                        <Crown size={14} className="text-yellow-500" />
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Family Group">
        <div className="p-6 space-y-4">
          <Input
            label="Group Name"
            placeholder="The Smith Family"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <Button
            fullWidth
            onClick={() => createMutation.mutate(newGroupName)}
            disabled={!newGroupName || createMutation.isPending}
          >
            {createMutation.isPending ? "Creating..." : "Create Group"}
          </Button>
          {createMutation.error && (
            <p className="text-red-500 text-sm">{createMutation.error.message}</p>
          )}
        </div>
      </Modal>

      {/* Join Modal */}
      <Modal open={showJoin} onClose={() => setShowJoin(false)} title="Join Family Group">
        <div className="p-6 space-y-4">
          <Input
            label="Invite Code"
            placeholder="ABC123"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            maxLength={6}
          />
          <Button
            fullWidth
            onClick={() => joinMutation.mutate(joinCode)}
            disabled={joinCode.length < 6 || joinMutation.isPending}
          >
            {joinMutation.isPending ? "Joining..." : "Join Group"}
          </Button>
          {joinMutation.error && (
            <p className="text-red-500 text-sm">{joinMutation.error.message}</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
