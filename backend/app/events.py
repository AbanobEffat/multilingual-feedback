import asyncio, json, time
from typing import Set

_subscribers: Set[asyncio.Queue] = set()

async def subscribe() -> asyncio.Queue:
    q: asyncio.Queue = asyncio.Queue()
    _subscribers.add(q)
    return q

async def unsubscribe(q: asyncio.Queue):
    _subscribers.discard(q)

async def publish(payload: dict):
    # fan-out to all current subscribers
    for q in list(_subscribers):
        try:
            q.put_nowait(payload)
        except Exception:
            pass

async def notify_stats_changed():
    await publish({"type": "stats_updated", "ts": time.time()})
