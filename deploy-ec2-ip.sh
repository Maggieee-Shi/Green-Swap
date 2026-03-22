#!/bin/bash
set -e

INSTANCE_ID="i-0218a57273ef3ddda"

echo "=== Waiting for instance to be running ==="
aws ec2 wait instance-running --instance-ids $INSTANCE_ID
echo "Instance is running!"

echo "=== Allocating Elastic IP ==="
ALLOC_ID=$(aws ec2 allocate-address --domain vpc --query 'AllocationId' --output text)
aws ec2 associate-address --instance-id $INSTANCE_ID --allocation-id $ALLOC_ID
ELASTIC_IP=$(aws ec2 describe-addresses --allocation-ids $ALLOC_ID --query 'Addresses[0].PublicIp' --output text)

echo ""
echo "=============================="
echo "EC2 ELASTIC IP: $ELASTIC_IP"
echo "=============================="
echo "SSH command:"
echo "ssh -i greenswap-key.pem ec2-user@$ELASTIC_IP"
