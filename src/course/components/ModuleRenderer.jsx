import * as Babel from "@babel/standalone";
import * as React from "react";
import { useMemo } from "react";

function normalizeSource(source) {
  const trimmed = String(source || "").trim();
  if (!trimmed) {
    return "function CourseModule(){ return null; }";
  }

  if (/export\s+default\s+function\s+[A-Za-z_$]/.test(trimmed)) {
    return trimmed.replace(/export\s+default\s+function\s+/, "function ");
  }
  if (/export\s+default\s+function\s*\(/.test(trimmed)) {
    return trimmed.replace(/export\s+default\s+function\s*\(/, "function CourseModule(");
  }
  if (/export\s+default\s+/.test(trimmed)) {
    return trimmed.replace(/export\s+default\s+/, "const CourseModule = ");
  }
  if (/function\s+CourseModule|const\s+CourseModule|class\s+CourseModule/.test(trimmed)) {
    return trimmed;
  }
  return `function CourseModule(){ return (${trimmed}); }`;
}

function compileModule(source) {
  const normalized = normalizeSource(source);
  const compiled = Babel.transform(normalized, {
    presets: [["react", { runtime: "classic" }]],
    filename: "firestore-course-module.jsx"
  }).code;

  const factory = new Function(
    "React",
    "props",
    `"use strict";
    const { useState, useEffect, useMemo, useRef, useCallback } = React;
    ${compiled}
    if (typeof CourseModule !== "function") {
      throw new Error("Course module must define or export CourseModule");
    }
    return React.createElement(CourseModule, props);`
  );

  return factory;
}

export default function ModuleRenderer({ jsx, module, session }) {
  const rendered = useMemo(() => {
    if (!jsx) {
      return { status: "loading", node: null, error: null };
    }
    try {
      const factory = compileModule(jsx);
      return {
        status: "ready",
        node: factory(React, { module, session }),
        error: null
      };
    } catch (error) {
      return { status: "error", node: null, error };
    }
  }, [jsx, module, session]);

  if (rendered.status === "loading") {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-white/70">
        Loading protected module...
      </div>
    );
  }

  if (rendered.status === "error") {
    return (
      <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-6 text-red-100">
        <h2 className="text-xl font-semibold">Module failed to render</h2>
        <p className="mt-2 text-sm text-red-100/80">{rendered.error.message}</p>
      </div>
    );
  }

  return <>{rendered.node}</>;
}
