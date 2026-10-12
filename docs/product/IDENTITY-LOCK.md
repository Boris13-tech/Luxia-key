# Identity lock — design only

The API denies non-active or missing security states. The PostgreSQL state guard is groundwork, not an implemented user lock/unlock workflow.
Future lock must atomically stop new authorization and revoke sessions; unlock needs separately reviewed strong verification/recovery. Notification receipt cannot unlock. Frozen prototype lockdown state is local simulation.
