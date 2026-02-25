"use client";

import { useEffect } from "react";

const BRAND_REGEX = /kishori vatika/gi;

function shouldSkipNode(node) {
  const parent = node.parentElement;
  if (!parent) return true;
  if (parent.closest(".font-forte")) return true;
  if (parent.closest("script,style,noscript,textarea,code,pre")) return true;
  if (parent.closest("[contenteditable='true']")) return true;
  return false;
}

function wrapBrandText(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const targets = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (shouldSkipNode(node)) continue;
    if (!node.nodeValue || !BRAND_REGEX.test(node.nodeValue)) continue;
    targets.push(node);
  }

  for (const node of targets) {
    const text = node.nodeValue;
    if (!text) continue;

    BRAND_REGEX.lastIndex = 0;
    let lastIndex = 0;
    let match;
    const frag = document.createDocumentFragment();

    while ((match = BRAND_REGEX.exec(text)) !== null) {
      const before = text.slice(lastIndex, match.index);
      if (before) frag.appendChild(document.createTextNode(before));

      const span = document.createElement("span");
      span.className = "font-forte";
      span.textContent = match[0];
      frag.appendChild(span);

      lastIndex = match.index + match[0].length;
    }

    const after = text.slice(lastIndex);
    if (after) frag.appendChild(document.createTextNode(after));

    node.replaceWith(frag);
  }
}

export function BrandFontAutoApply() {
  useEffect(() => {
    let rafId = 0;
    const run = () => {
      rafId = 0;
      wrapBrandText(document.body);
    };

    const schedule = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(run);
    };

    schedule();

    const observer = new MutationObserver(schedule);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
