import redis

r = redis.Redis(
    host='redis-18580.c241.us-east-1-4.ec2.redns.redis-cloud.com',
    port=18580,
    decode_responses=True,
    username="default",
    password="ADFxxLTctR5qSnOgTTvRC4hEdABh6028",
)

# Test connection
try:
    print("PING →", r.ping())  # should print: PING → True
except redis.ConnectionError as e:
    print("Connection failed:", e)

# Your CRUD
r.set('foo', 'bar')
print("GET foo →", r.get('foo'))  # should print: GET foo → bar
