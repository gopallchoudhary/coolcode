import { useCallback, useRef, useState } from "react";
import { EventSourceParserStream } from "eventsource-parser/stream";
import prettyMs from "pretty-ms";
import type { ClientResponse } from "hono/client";
import { apiClient } from "../lib/api-client";
import { getErrorMessages } from "../lib/http-errors";
import type { Mode } from "@coolcode/database/enums";
import {
    chatStreamEventSchema,
    type SupportedChatModelId,
} from "@coolcode/shared";

export type ClientMessagePart = { type: "text"; text: string };

export type Message =
    | {
        id: string;
        role: "user";
        content: string;
        mode: Mode;
        model: SupportedChatModelId;
    }
    | {
        id: string;
        role: "assistant";
        content: string;
        mode: Mode;
        model: SupportedChatModelId;
        parts: ClientMessagePart[];
        duration?: string;
    };

type StreamingState =
    | { status: "idle" }
    | {
        status: "streaming";
        parts: ClientMessagePart[];
        mode: Mode;
        model: SupportedChatModelId
    };

type ActiveStream = {
    requestId: string;
    controller: AbortController;
    mode: Mode;
    model: SupportedChatModelId;
    parts: ClientMessagePart[];
    interruptedCaptured: boolean;
};

type SubmitParams = {
    userText: string;
    mode: Mode;
    model: SupportedChatModelId;
};

type RunStreamParams = {
    mode: Mode;
    model: SupportedChatModelId;
    request: (controller: AbortController) => Promise<ClientResponse<unknown>>;
};
