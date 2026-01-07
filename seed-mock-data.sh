#!/bin/bash
#
# seed-mock-data.sh - WordPress Mock Data Generator
#
# Seeds a WordPress installation with mock data including posts, pages,
# comments, and media. Supports different site topics and content volumes.
#
# Usage: ./seed-mock-data.sh
#
# Requirements:
#   - wp-env must be running (npm run wp-env start from gutenberg/)
#   - Run from repository root
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track created content for summary
POSTS_CREATED=0
PAGES_CREATED=0
COMMENTS_CREATED=0
MEDIA_CREATED=0

# Store post IDs for comments and media
POST_IDS=()

#
# Helper Functions
#

print_header() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_info() {
    echo -e "${YELLOW}→${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Run WP-CLI command through wp-env
run_wp() {
    cd "$SCRIPT_DIR/gutenberg" && npm run wp-env run cli --silent -- wp "$@" 2>/dev/null
}

#
# Content Volume Configuration
#

set_volume_small() {
    NUM_POSTS=5
    NUM_PAGES=3
    NUM_COMMENTS=10
    NUM_MEDIA=5
}

set_volume_medium() {
    NUM_POSTS=15
    NUM_PAGES=6
    NUM_COMMENTS=30
    NUM_MEDIA=10
}

set_volume_large() {
    NUM_POSTS=30
    NUM_PAGES=10
    NUM_COMMENTS=60
    NUM_MEDIA=20
}

#
# Comment Author Names
#

COMMENT_AUTHORS=(
    "Sarah M."
    "Mike Johnson"
    "Emily Chen"
    "David R."
    "Lisa Thompson"
    "James Wilson"
    "Maria Garcia"
    "Alex Kim"
    "Jennifer Lee"
    "Chris Brown"
    "Amanda S."
    "Ryan O'Brien"
    "Samantha Patel"
    "Tom H."
    "Natalie Wong"
)

#
# Content Getter Functions (bash 3.2 compatible)
#

get_pages() {
    case "$TOPIC" in
        band)
            echo "Home|Welcome to The Midnight Echo|We're a 4-piece indie rock band from Portland, Oregon. Blending nostalgic synths with driving guitars, we create soundscapes that feel like late-night drives through neon-lit streets. Check out our latest releases and upcoming shows!"
            echo "About the Band|Our Story|Formed in 2019 in a cramped basement studio, The Midnight Echo emerged from a shared love of 80s synth-pop and modern indie rock. What started as late-night jam sessions between college friends quickly evolved into something bigger. Our debut EP 'Neon Dreams' dropped in 2020, and we haven't looked back since."
            echo "Tour Dates|Upcoming Shows|We're hitting the road! Check back often for new dates and venues. Sign up for our newsletter to get early access to tickets and exclusive meet-and-greet opportunities."
            echo "Discography|Our Music|From our first EP to our latest singles, explore the complete catalog of The Midnight Echo. Each release tells a different chapter of our story."
            echo "Contact|Get in Touch|For booking inquiries, press requests, or just to say hi - we'd love to hear from you. Follow us on social media for daily updates and behind-the-scenes content."
            echo "Merch|Official Merchandise|Rep The Midnight Echo with our official merch. From vintage-style tees to limited edition vinyl, find something that speaks to you."
            ;;
        coffee)
            echo "Home|Welcome to Ember & Oak|Your neighborhood coffee shop serving thoughtfully sourced, expertly roasted coffee since 2018. We believe great coffee brings people together - stop by for a cup and become part of our community."
            echo "About Us|Our Story|Ember & Oak started with a simple dream: create a space where exceptional coffee meets genuine community. Founded by two friends who met at a coffee roasting workshop, we've grown from a tiny cart at the farmers market to the cozy shop you see today."
            echo "Menu|What We're Serving|From our signature house blend to seasonal single-origins, rotating pastries to light bites - explore everything we have to offer. All beans roasted locally, all pastries baked fresh daily."
            echo "Locations|Find Us|Visit us at our downtown location or catch our mobile cart at local events. We're always brewing somewhere in the city!"
            echo "Catering|Events & Catering|Bring Ember & Oak to your next event. We offer full-service coffee catering for corporate events, weddings, and private parties. Let us create a custom coffee experience for your guests."
            echo "Contact|Say Hello|Questions? Feedback? Just want to chat about coffee? We'd love to hear from you. Drop us a line or stop by - the coffee's always on."
            ;;
        org)
            echo "Home|Welcome to Riverside Community Alliance|Building a stronger, more connected community through volunteer programs, local initiatives, and neighborhood support. Together, we make Riverside a better place to live."
            echo "About Us|Who We Are|Riverside Community Alliance was founded in 2015 by a group of neighbors who saw a need and decided to act. What started as a small food drive has grown into a thriving organization serving thousands of community members each year."
            echo "Our Mission|What Drives Us|We believe everyone deserves access to essential resources, meaningful connections, and opportunities to thrive. Our programs address food insecurity, provide educational support, and create spaces for neighbors to come together."
            echo "Events|What's Happening|From monthly community dinners to annual festivals, there's always something happening at RCA. Check our calendar and join us!"
            echo "Get Involved|Make a Difference|There are so many ways to contribute - volunteer your time, donate supplies, or simply spread the word. Every action matters, and together we can accomplish incredible things."
            echo "Contact|Connect With Us|Have questions? Want to learn more? We'd love to hear from you. Our doors are always open to neighbors who want to get involved."
            ;;
    esac
}

get_post_titles() {
    case "$TOPIC" in
        band)
            echo "Last Night's Show at The Roxy Was Unforgettable"
            echo "New Single 'Electric Sunset' Drops Friday"
            echo "Behind the Scenes: Recording Our Next Album"
            echo "Fan Spotlight: Your Cover Videos Are Amazing"
            echo "Announcing Our Summer Tour 2024"
            echo "The Story Behind 'Midnight Drive'"
            echo "Studio Update: Week 3 of Recording"
            echo "Thanks Portland - What an Incredible Hometown Show"
            echo "New Music Video Coming Soon"
            echo "Our Favorite Gear: What We Use on Stage"
            echo "Throwback: Our First Ever Gig"
            echo "Collaborating with Local Artists"
            echo "The Making of Our Album Art"
            echo "Acoustic Sessions Now on YouTube"
            echo "Meet the Band: Q&A with Our Drummer"
            echo "Pre-Save Our New Album Now"
            echo "Festival Season Lineup Announced"
            echo "Limited Edition Vinyl Now Available"
            echo "Writing Songs on the Road"
            echo "Thank You for 100K Streams"
            echo "New Merch Drop This Weekend"
            echo "Our Influences: The Artists Who Shaped Our Sound"
            echo "Rehearsal Room Tour"
            echo "Signed Posters Giveaway"
            echo "Looking Back at Our First Year"
            echo "Sneak Peek: Unreleased Track"
            echo "Meet Our New Bassist"
            echo "Tour Documentary Coming Soon"
            echo "Best Moments from Last Night"
            echo "See You at the Afterparty"
            ;;
        coffee)
            echo "Introducing Our New Ethiopian Single Origin"
            echo "Latte Art Workshop: Sign Up Now!"
            echo "Meet Our New Barista: Welcome, Jamie!"
            echo "Seasonal Menu: Fall Favorites Are Here"
            echo "Community Corner: Local Artist Showcase"
            echo "The Perfect Pour Over: A Guide"
            echo "Why We Source Directly from Farmers"
            echo "New Pastry Alert: Brown Butter Croissants"
            echo "Behind the Bar: A Day at Ember & Oak"
            echo "Cold Brew Season: Tips for Brewing at Home"
            echo "Celebrating 5 Years of Ember & Oak"
            echo "Our Favorite Coffee Books"
            echo "Weekend Special: Maple Oat Latte"
            echo "Sustainable Practices at Ember & Oak"
            echo "Holiday Gift Guide for Coffee Lovers"
            echo "The Story Behind Our House Blend"
            echo "Cupping Session This Saturday"
            echo "New Mugs Just Arrived"
            echo "Partner Spotlight: Local Bakery Collab"
            echo "Morning Rituals: How Our Team Starts the Day"
            echo "Extended Hours This Week"
            echo "Coffee and Vinyl: New Record Selection"
            echo "Thank You for an Amazing Year"
            echo "New Seasonal Syrup: Lavender Honey"
            echo "Barista Competition Recap"
            echo "Your Favorite Orders: Top 10"
            echo "Behind the Roast: Process Explained"
            echo "Live Music This Friday"
            echo "Kids Menu Now Available"
            echo "Summer Hours Announcement"
            ;;
        org)
            echo "Volunteer Spotlight: Meet Sarah"
            echo "Community Garden: Spring Planting Day"
            echo "Thank You to Our Holiday Donors"
            echo "New Youth Mentorship Program Launching"
            echo "Food Drive Recap: A Record-Breaking Year"
            echo "Neighborhood Cleanup This Saturday"
            echo "Meet Our New Executive Director"
            echo "Summer Camp Registration Now Open"
            echo "Community Dinner: All Are Welcome"
            echo "Local Business Partnership Announcement"
            echo "Volunteer Appreciation Night"
            echo "Impact Report: What We Accomplished Together"
            echo "Free Tax Preparation Clinic"
            echo "Story Time at the Community Center"
            echo "Senior Services Program Expanding"
            echo "Annual Fundraiser: Save the Date"
            echo "New Computer Lab Now Open"
            echo "Community Art Project Unveiled"
            echo "Thanksgiving Meal Distribution"
            echo "Year in Review: 2023 Highlights"
            echo "Board Member Elections Coming Up"
            echo "ESL Classes Starting Next Month"
            echo "Back to School Supply Drive"
            echo "Community Health Fair This Weekend"
            echo "New Partnership with Local Library"
            echo "Emergency Relief Fund Update"
            echo "Volunteer Training Session"
            echo "Community Survey: We Want Your Input"
            echo "Celebrating 8 Years of Service"
            echo "Winter Coat Drive Begins"
            ;;
    esac
}

get_post_contents() {
    case "$TOPIC" in
        band)
            echo "What an incredible night! The energy in the room was electric from the first chord to the final encore. Thank you to everyone who came out and made it so special. The way you all sang along to every word - that's something we'll never forget. Already counting down the days until we can do it again."
            echo "We've been working on this one for months, and we can't wait for you to hear it. 'Electric Sunset' is probably our most personal track yet - written during those late summer nights when everything feels possible. Pre-save link in our bio!"
            echo "Week two in the studio and the new album is really starting to take shape. We've been experimenting with some new sounds - think vintage synths meets modern production. Can't wait to share more with you soon."
            echo "We've been watching all of your cover videos and honestly, we're blown away. The creativity and talent in this community is unreal. Keep them coming - we might feature our favorites on our next post!"
            echo "The moment you've been waiting for - tour dates are HERE! We're hitting 15 cities across the country this summer. Tickets go on sale Friday at 10am local time. See you out there!"
            echo "People always ask about this song. It started as a late-night voice memo, just a melody hummed into a phone at 3am. Something about that raw, half-asleep honesty felt right, so we built the whole track around preserving that feeling."
            echo "The coffee consumption in this studio is reaching dangerous levels, but honestly? We've never been more excited about the music we're making. This album feels like the most 'us' thing we've ever created."
            echo "Portland, you never disappoint. Playing our hometown is always special, but last night was something else entirely. Seeing familiar faces in the crowd, friends and family - it reminded us why we started doing this in the first place."
            echo "We shot something special last week. The new music video is unlike anything we've done before - more cinematic, more emotional. Director's cut dropping next month. Trust us, this one's worth the wait."
            echo "We get asked about our gear constantly, so here's the rundown: a 1978 Juno-60, a Fender Jazzmaster through a vintage Twin Reverb, and way too many pedals. The magic is in how you use it, not what you use."
            ;;
        coffee)
            echo "We're excited to announce our latest addition - a stunning Ethiopian Yirgacheffe with notes of blueberry, jasmine, and honey. This natural-processed gem comes from the Gedeb region, where family farmers have been perfecting their craft for generations. Available now as pour-over or whole bean to take home."
            echo "Ever wanted to learn how to pour a perfect rosetta? Join us next Saturday for a hands-on latte art workshop! Limited to 8 participants to ensure everyone gets plenty of practice time. Coffee provided, smiles guaranteed."
            echo "Please join us in welcoming Jamie to the Ember & Oak family! With five years of specialty coffee experience and an infectious enthusiasm for all things espresso, Jamie brings expertise and warmth to every cup. Stop by and say hello!"
            echo "The leaves are changing, and so is our menu. Introducing our fall lineup: Spiced Pear Latte, Toasted Pecan Cold Brew, and the return of everyone's favorite - Pumpkin Cardamom Chai. Available through November."
            echo "This month, we're featuring the work of local artist Maya Chen on our gallery wall. Her coffee-inspired watercolors capture the quiet moments we all cherish - that first sip of morning coffee, the steam rising from a fresh cup. Stop by to see the collection."
            echo "There's something meditative about the pour-over process. The slow, circular pour, the bloom of fresh grounds, the patience required for a perfect cup. Here's our guide to mastering this classic brewing method at home."
            echo "We believe in knowing where our coffee comes from. That's why we work directly with farmers in Colombia, Ethiopia, and Guatemala. Fair prices, sustainable practices, and incredible coffee - it's a relationship that benefits everyone."
            echo "Our pastry case just got an upgrade! We're now serving brown butter croissants from our friends at Flour & Water Bakery. Flaky, buttery, with that perfect golden crust. Pairs beautifully with our house espresso."
            echo "What really goes on behind the counter? Early mornings, endless cleaning, and the best conversations with our regulars. Here's a peek into a typical day at Ember & Oak - the chaos, the coffee, and everything in between."
            echo "With temperatures rising, it's cold brew season! Here's how we make ours at the shop, plus tips for brewing your own at home. The secret? Low and slow, with freshly ground beans and plenty of patience."
            ;;
        org)
            echo "This month we're highlighting Sarah, who has been volunteering with us for over two years. Her dedication to our community garden project has transformed a vacant lot into a thriving green space. 'I love seeing neighbors come together,' Sarah says. 'The garden has become a gathering place for the whole community.'"
            echo "Spring is here, and that means it's time to get our hands dirty! Join us this Saturday for our annual spring planting day at the community garden. We'll be planting vegetables, herbs, and flowers. All ages welcome - no gardening experience necessary!"
            echo "The generosity of our community never ceases to amaze us. Thanks to your donations, we were able to provide holiday meals to over 500 families this season. Every dollar, every canned good, every hour volunteered made a real difference in someone's life."
            echo "We're thrilled to announce our new youth mentorship program, connecting local teens with adult volunteers for guidance, support, and skill-building. Applications for both mentors and mentees are now open."
            echo "What a year it's been! Our annual food drive collected over 15,000 pounds of food - a new record. This wouldn't be possible without our incredible volunteers, local businesses, and community members who donated. Together, we're fighting food insecurity one can at a time."
            echo "Let's show our neighborhood some love! Join us Saturday morning for a community cleanup. We'll meet at the community center at 9am and spend a few hours picking up litter, removing graffiti, and beautifying our streets. Supplies provided, coffee included!"
            echo "We're excited to welcome Maria Rodriguez as our new Executive Director. Maria brings 15 years of nonprofit experience and a deep commitment to community service. 'I'm honored to lead an organization that makes such a tangible difference,' Maria says."
            echo "Registration for our summer day camp is now open! Camp runs Monday-Friday for six weeks, offering activities in arts, sports, STEM, and more. Scholarships available for families who need assistance."
            echo "Our monthly community dinner returns this Thursday at 6pm. These dinners are about more than food - they're about connection. Come share a meal, meet your neighbors, and strengthen the bonds that make our community special."
            echo "We're proud to announce a new partnership with Downtown Hardware! They'll be matching donations for our home repair program and providing supplies for community projects. Local businesses supporting local causes - this is what community looks like."
            ;;
    esac
}

get_comments() {
    case "$TOPIC" in
        band)
            echo "Best show I've seen all year! When are you coming back to LA?"
            echo "This band is so underrated. Sharing with everyone I know!"
            echo "The new single is on repeat. Can't get enough of that chorus."
            echo "Saw you guys in Seattle last month - absolutely incredible energy."
            echo "Been a fan since the first EP. So proud of how far you've come!"
            echo "That guitar solo gave me chills. Pure magic."
            echo "Please come to Europe! We need you here!"
            echo "Met you at the merch table last show - you guys are so genuine."
            echo "The lyrics on this one hit different. Thanks for being so real."
            echo "My favorite band right now, no question."
            echo "Bought tickets the second they went on sale. Can't wait!"
            echo "This is the soundtrack to my summer."
            echo "Love the new direction you're taking with the sound."
            echo "Introduced my parents to your music - now they're fans too!"
            echo "The production on this track is incredible. Who produced it?"
            ;;
        coffee)
            echo "Just tried this today - absolutely delicious! The fruity notes are perfect."
            echo "Best coffee in the city, hands down. I'm here almost every morning."
            echo "The baristas here are so knowledgeable. Always happy to answer questions."
            echo "That maple latte is EVERYTHING. Please make it permanent!"
            echo "Love the cozy atmosphere. Perfect place to work or catch up with friends."
            echo "Your croissants have ruined all other croissants for me."
            echo "Just signed up for the workshop! Can't wait!"
            echo "The pour-over here is worth the wait. So smooth and flavorful."
            echo "Been coming here since you opened. Congrats on 5 years!"
            echo "My happy place. Thanks for creating such a welcoming space."
            echo "Finally tried the cold brew - wow, so refreshing!"
            echo "The new Ethiopian is incredible. Picked up a bag to brew at home."
            echo "Love supporting a local business that cares about sustainability."
            echo "Great wifi, better coffee. What more could you need?"
            echo "That latte art is almost too beautiful to drink. Almost."
            ;;
        org)
            echo "Sarah is amazing! She helped me get started volunteering last year."
            echo "Can't wait for the planting day. My kids loved it last year!"
            echo "Thank you for everything you do for our community."
            echo "The mentorship program sounds wonderful. Just signed up as a mentor."
            echo "Your food drive helped our family through a tough time. Grateful beyond words."
            echo "I'll be there Saturday with my whole family!"
            echo "Congratulations Maria! RCA is lucky to have you."
            echo "Just registered my daughter for camp. She's so excited!"
            echo "The community dinners are my favorite thing. Always leave feeling connected."
            echo "Love seeing local businesses step up like this."
            echo "Volunteering here changed my life. So rewarding."
            echo "The impact report is incredible. Look at what we accomplished together!"
            echo "Will there be childcare at the training session?"
            echo "Best organization in Riverside. So well run and impactful."
            echo "Can't wait to see the art project! The kids worked so hard on it."
            ;;
    esac
}

get_image_terms() {
    case "$TOPIC" in
        band)
            echo "concert+crowd"
            echo "guitar+musician"
            echo "recording+studio"
            echo "band+live"
            echo "music+stage"
            echo "drummer+performance"
            echo "singer+microphone"
            echo "indie+band"
            echo "concert+lights"
            echo "vinyl+records"
            ;;
        coffee)
            echo "coffee+latte"
            echo "cafe+interior"
            echo "espresso+machine"
            echo "barista+pouring"
            echo "coffee+beans"
            echo "pastry+croissant"
            echo "cozy+cafe"
            echo "pour+over+coffee"
            echo "coffee+shop"
            echo "latte+art"
            ;;
        org)
            echo "volunteer+community"
            echo "food+bank"
            echo "community+garden"
            echo "charity+event"
            echo "neighborhood+cleanup"
            echo "community+center"
            echo "volunteers+helping"
            echo "donation+drive"
            echo "community+dinner"
            echo "nonprofit+team"
            ;;
    esac
}

#
# Content Creation Functions
#

create_pages() {
    print_header "Creating Pages"

    # Read pages into array first (avoids stdin issues with run_wp)
    local pages=()
    while IFS= read -r line; do
        pages+=("$line")
    done < <(get_pages)

    local count=0
    for page_data in "${pages[@]}"; do
        if [ $count -ge $NUM_PAGES ]; then
            break
        fi

        # Parse pipe-delimited data
        local title heading content
        IFS='|' read -r title heading content <<< "$page_data"

        # Combine heading and content with HTML
        local full_content="<h2>${heading}</h2><p>${content}</p>"

        print_info "Creating page: $title"

        run_wp post create \
            --post_type=page \
            --post_title="$title" \
            --post_content="$full_content" \
            --post_status=publish \
            --porcelain > /dev/null

        count=$((count + 1))
        PAGES_CREATED=$((PAGES_CREATED + 1))
    done

    print_success "Created $count pages"
}

create_posts() {
    print_header "Creating Posts"

    # Read titles and contents into arrays
    local titles=()
    while IFS= read -r line; do
        titles+=("$line")
    done < <(get_post_titles)

    local contents=()
    while IFS= read -r line; do
        contents+=("$line")
    done < <(get_post_contents)

    local content_count=${#contents[@]}
    local i=0

    for title in "${titles[@]}"; do
        if [ $i -ge $NUM_POSTS ]; then
            break
        fi

        local content="${contents[$((i % content_count))]}"
        local full_content="<p>${content}</p>"

        # Generate a random date within the last 6 months
        local days_ago=$((RANDOM % 180))
        local post_date
        post_date=$(date -v-${days_ago}d +"%Y-%m-%d %H:%M:%S" 2>/dev/null || date -d "${days_ago} days ago" +"%Y-%m-%d %H:%M:%S")

        print_info "Creating post: $title"

        local post_id
        post_id=$(run_wp post create \
            --post_type=post \
            --post_title="$title" \
            --post_content="$full_content" \
            --post_status=publish \
            --post_date="$post_date" \
            --porcelain)

        # Store post ID for comments and media
        POST_IDS+=("$post_id")
        POSTS_CREATED=$((POSTS_CREATED + 1))
        i=$((i + 1))
    done

    print_success "Created $POSTS_CREATED posts"
}

create_comments() {
    print_header "Creating Comments"

    if [ ${#POST_IDS[@]} -eq 0 ]; then
        print_error "No posts available for comments"
        return
    fi

    # Read comments into array
    local comments=()
    while IFS= read -r line; do
        comments+=("$line")
    done < <(get_comments)

    local comment_count=${#comments[@]}
    local author_count=${#COMMENT_AUTHORS[@]}

    for ((i=0; i<NUM_COMMENTS; i++)); do
        # Pick a random post
        local post_id="${POST_IDS[$((RANDOM % ${#POST_IDS[@]}))]}"

        # Pick comment content and author
        local comment="${comments[$((i % comment_count))]}"
        local author="${COMMENT_AUTHORS[$((RANDOM % author_count))]}"
        local email
        email=$(echo "$author" | tr ' ' '.' | tr '[:upper:]' '[:lower:]')@example.com

        run_wp comment create \
            --comment_post_ID="$post_id" \
            --comment_content="$comment" \
            --comment_author="$author" \
            --comment_author_email="$email" \
            --porcelain > /dev/null

        COMMENTS_CREATED=$((COMMENTS_CREATED + 1))
    done

    print_success "Created $NUM_COMMENTS comments"
}

import_media() {
    print_header "Importing Media"

    # Read image terms into array
    local terms=()
    while IFS= read -r line; do
        terms+=("$line")
    done < <(get_image_terms)

    local term_count=${#terms[@]}
    local success_count=0

    for ((i=0; i<NUM_MEDIA && i<${#POST_IDS[@]}; i++)); do
        local post_id="${POST_IDS[$i]}"
        local term="${terms[$((i % term_count))]}"

        # Use placehold.co for reliable placeholder images (no redirects)
        # Add variety with different colors
        local colors=("1a1a2e" "16213e" "0f3460" "533483" "e94560" "2d4059" "ff6b6b" "4ecdc4" "45b7d1" "96ceb4")
        local color="${colors[$((i % 10))]}"
        local text_color="ffffff"
        local label
        label=$(echo "$term" | tr '+' ' ')

        # URL encode the label for the URL
        local encoded_label
        encoded_label=$(echo "$label" | sed 's/ /%20/g')

        local image_url="https://placehold.co/800x600/${color}/${text_color}.jpg?text=${encoded_label}"

        print_info "Importing image for post $post_id ($label)"

        # Import the image and set as featured
        if run_wp media import "$image_url" \
            --post_id="$post_id" \
            --title="$label" \
            --featured_image \
            --porcelain > /dev/null 2>&1; then
            success_count=$((success_count + 1))
        else
            print_error "Failed to import image for post $post_id"
        fi

        MEDIA_CREATED=$((MEDIA_CREATED + 1))
    done

    print_success "Imported $success_count of $NUM_MEDIA media items"
}

show_summary() {
    print_header "Summary"
    echo "Mock data generation complete!"
    echo ""
    echo "  Topic:    $TOPIC_DISPLAY"
    echo "  Posts:    $POSTS_CREATED"
    echo "  Pages:    $PAGES_CREATED"
    echo "  Comments: $COMMENTS_CREATED"
    echo "  Media:    $MEDIA_CREATED"
    echo ""
    echo -e "${GREEN}Visit http://localhost:8888 to see your content!${NC}"
    echo ""
}

reset_content() {
    print_header "Resetting Site Content"

    # Delete all comments
    print_info "Deleting comments..."
    local comment_ids
    comment_ids=$(run_wp comment list --format=ids 2>/dev/null)
    if [ -n "$comment_ids" ]; then
        run_wp comment delete $comment_ids --force > /dev/null 2>&1
        print_success "Deleted comments"
    else
        print_info "No comments to delete"
    fi

    # Delete all posts
    print_info "Deleting posts..."
    local post_ids
    post_ids=$(run_wp post list --post_type=post --format=ids 2>/dev/null)
    if [ -n "$post_ids" ]; then
        run_wp post delete $post_ids --force > /dev/null 2>&1
        print_success "Deleted posts"
    else
        print_info "No posts to delete"
    fi

    # Delete all pages (except sample page if you want to keep it)
    print_info "Deleting pages..."
    local page_ids
    page_ids=$(run_wp post list --post_type=page --format=ids 2>/dev/null)
    if [ -n "$page_ids" ]; then
        run_wp post delete $page_ids --force > /dev/null 2>&1
        print_success "Deleted pages"
    else
        print_info "No pages to delete"
    fi

    # Delete all media/attachments
    print_info "Deleting media..."
    local media_ids
    media_ids=$(run_wp post list --post_type=attachment --format=ids 2>/dev/null)
    if [ -n "$media_ids" ]; then
        run_wp post delete $media_ids --force > /dev/null 2>&1
        print_success "Deleted media"
    else
        print_info "No media to delete"
    fi

    print_header "Reset Complete"
    echo -e "${GREEN}All content has been removed.${NC}"
    echo ""
}

check_wp_env() {
    print_info "Checking wp-env status..."

    if ! cd "$SCRIPT_DIR/gutenberg" 2>/dev/null; then
        print_error "Could not find gutenberg directory"
        exit 1
    fi

    # Try a simple WP-CLI command to check if wp-env is running
    if ! npm run wp-env run cli --silent -- wp option get siteurl > /dev/null 2>&1; then
        print_error "wp-env doesn't appear to be running"
        echo ""
        echo "Start it with:"
        echo "  cd gutenberg && npm run wp-env start"
        echo ""
        exit 1
    fi

    print_success "wp-env is running"
}

#
# Main Script
#

generate_content() {
    # Topic selection
    echo "Select a site topic:"
    echo ""
    PS3="Enter choice (1-3): "
    select topic_choice in "Small Band" "Coffee Shop" "Local Organization"; do
        case $topic_choice in
            "Small Band")
                TOPIC="band"
                TOPIC_DISPLAY="Small Band"
                break
                ;;
            "Coffee Shop")
                TOPIC="coffee"
                TOPIC_DISPLAY="Coffee Shop"
                break
                ;;
            "Local Organization")
                TOPIC="org"
                TOPIC_DISPLAY="Local Organization"
                break
                ;;
            *)
                echo "Invalid choice. Please select 1-3."
                ;;
        esac
    done

    echo ""

    # Volume selection
    echo "Select content volume:"
    echo ""
    echo "  Small:  5 posts, 3 pages, 10 comments, 5 images"
    echo "  Medium: 15 posts, 6 pages, 30 comments, 10 images"
    echo "  Large:  30 posts, 10 pages, 60 comments, 20 images"
    echo ""
    PS3="Enter choice (1-3): "
    select volume_choice in "Small" "Medium" "Large"; do
        case $volume_choice in
            "Small")
                set_volume_small
                break
                ;;
            "Medium")
                set_volume_medium
                break
                ;;
            "Large")
                set_volume_large
                break
                ;;
            *)
                echo "Invalid choice. Please select 1-3."
                ;;
        esac
    done

    echo ""

    # Confirmation
    echo -e "${YELLOW}Ready to generate:${NC}"
    echo "  Topic:    $TOPIC_DISPLAY"
    echo "  Posts:    $NUM_POSTS"
    echo "  Pages:    $NUM_PAGES"
    echo "  Comments: $NUM_COMMENTS"
    echo "  Media:    $NUM_MEDIA"
    echo ""
    read -p "Continue? (y/n): " confirm

    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        echo "Cancelled."
        exit 0
    fi

    # Generate content
    create_pages
    create_posts
    create_comments
    import_media

    # Show summary
    show_summary
}

main() {
    clear
    print_header "WordPress Mock Data Generator"

    # Check wp-env is running
    check_wp_env

    echo ""

    # Action selection
    echo "What would you like to do?"
    echo ""
    PS3="Enter choice (1-3): "
    select action_choice in "Generate mock content" "Reset all content" "Reset and generate new content"; do
        case $action_choice in
            "Generate mock content")
                echo ""
                generate_content
                break
                ;;
            "Reset all content")
                echo ""
                echo -e "${RED}WARNING: This will delete ALL posts, pages, comments, and media!${NC}"
                read -p "Are you sure? (y/n): " confirm
                if [[ "$confirm" =~ ^[Yy]$ ]]; then
                    reset_content
                else
                    echo "Cancelled."
                fi
                break
                ;;
            "Reset and generate new content")
                echo ""
                echo -e "${RED}WARNING: This will delete ALL existing content before generating new content!${NC}"
                read -p "Are you sure? (y/n): " confirm
                if [[ "$confirm" =~ ^[Yy]$ ]]; then
                    reset_content
                    generate_content
                else
                    echo "Cancelled."
                fi
                break
                ;;
            *)
                echo "Invalid choice. Please select 1-3."
                ;;
        esac
    done
}

# Run main function
main
